package ktor.repository

import ktor.model.*
import ktor.tables.*
import ktor.tables.users.UserCards
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like
import org.jetbrains.exposed.sql.SqlExpressionBuilder.notLike
import org.jetbrains.exposed.sql.SqlExpressionBuilder.notInList
import org.jetbrains.exposed.sql.transactions.transaction

class ExposedCardsRepository : CardsRepository {

    private fun cardSetsColumns(): List<Column<out Any>> {
        return listOf(CardSets.name, CardSets.releaseDate)
    }

    private fun <T> collectTheThings(set: String, functionToRun: (String) -> List<T>): List<T> {
        val list: MutableList<T> = mutableListOf()
        set.split(",").forEach { list += functionToRun(it) }
        return list
    }

    private fun withCardUserCount(userId: String): Triple<Join, ExpressionAlias<Int?>, ExpressionAlias<Int?>> {
        val nfcTable = UserCards.alias("nonFoilCountTable")
        val nfcCountColumn = nfcTable[UserCards.count].alias("nfCount")
        val fcTable = UserCards.alias("foilCount")
        val fcCountColumn = fcTable[UserCards.count].alias("fCount")
        val joined = Cards
            .join(
                nfcTable,
                JoinType.LEFT,
                additionalConstraint = { (nfcTable[UserCards.userUuid] eq userId) and (nfcTable[UserCards.cardUuid] eq Cards.uuid) and (nfcTable[UserCards.isForcedFoilSet] eq false) })
            .join(
                fcTable,
                JoinType.LEFT,
                additionalConstraint = { (fcTable[UserCards.userUuid] eq userId) and (fcTable[UserCards.cardUuid] eq Cards.uuid) and ((fcTable[UserCards.isForcedFoilSet] eq true) or (fcTable[UserCards.isFoilOnly] eq true)) })
        return Triple(joined, nfcCountColumn, fcCountColumn)
    }


    private fun configureCardsInSet(selectOp: Op<Boolean>) = try {
        Cards
            .join(Identifiers, JoinType.LEFT, additionalConstraint = { Identifiers.cardId eq Cards.uuid })
            .join(CardPriceInfos, JoinType.LEFT, additionalConstraint = { CardPriceInfos.cardId eq Cards.uuid })
            .join(CardSets, JoinType.LEFT, additionalConstraint = { CardSets.code eq Cards.setCode })
            .slice(Cards.columns + Identifiers.columns + CardPriceInfos.columns + cardSetsColumns())
            .select { selectOp }
            .map { it.mapToCardDto() }
    } catch (cause: Throwable) {
        val msg = cause.message
        throw cause
    }

    private fun configureCardsInSetWithUserCount(userId: String, selectOp: Op<Boolean>): List<CardDto> {
        val (joinedTable, nfcCountColumn, fcCountColumn) = withCardUserCount(userId)

        return try {
            joinedTable
                .join(Identifiers, JoinType.LEFT, additionalConstraint = { Identifiers.cardId eq Cards.uuid })
                .join(CardPriceInfos, JoinType.LEFT, additionalConstraint = { CardPriceInfos.cardId eq Cards.uuid })
                .join(CardSets, JoinType.LEFT, additionalConstraint = { CardSets.code eq Cards.setCode })
                .slice(Cards.columns + Identifiers.columns + CardPriceInfos.columns + nfcCountColumn + fcCountColumn + CardSets.name + CardSets.releaseDate)
                .select { selectOp }
                .map {

                    it.mapToCardDto().copy(
                        countNonFoil = it[nfcCountColumn] ?: 0,
                        countFoil = it[fcCountColumn] ?: 0
                    )
                }
        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }

    override fun getArtistCards(artistName: String): List<CardDto> = transaction {
        val split = artistName.split(" ")
        var op: Op<Boolean> = Op.TRUE
        split.forEach {
            op = op and (Cards.artist like "%$it%")
        }
        configureCardsInSet(op)
    }

    override fun getArtistCardsWithUserCount(artistName: String, userId: String): List<CardDto> = transaction {
        val split = artistName.split(" ")
        var op: Op<Boolean> = Op.TRUE
        split.forEach {
            op = op and (Cards.artist like "%$it%")
        }
        configureCardsInSetWithUserCount(userId, op)
    }

    override fun getCardNameCards(cardName: String): List<CardDto> = transaction {
        configureCardsInSet(Cards.name eq cardName)
    }

    override fun getCardNameSearchStartsWith(cardName: String): List<CardDto> = transaction {
        configureCardsInSet(Cards.name like "$cardName%")
    }
    override fun getCardNameSearchStartsWithWithUserCount(cardName: String, userId: String): List<CardDto> = transaction {
        configureCardsInSetWithUserCount(userId, Cards.name like "$cardName%")
    }

    override fun getCardNameCardsWithUserCount(cardName: String, userId: String): List<CardDto> = transaction {
        configureCardsInSetWithUserCount(userId, Cards.name eq cardName)
    }

    override fun getCardsInSet(set: String): List<CardDto> = transaction {
        val functionToRun = { s: String ->
            val cardSet = originalSet(s)

            val refactorStep = selectOpOfFoilAndExtendedSets(s)
            val setSelect = Cards.setCode eq cardSet
            val selectOp = setSelect and refactorStep

            configureCardsInSet(selectOp)
        }
        collectTheThings(set, functionToRun)
    }

    override fun getCardsInParentAndChildSets(set: String): List<CardDto> = transaction {
        val cardSet = originalSet(set)

        val selectOp = exists(CardSets.select { (CardSets.parentCode eq cardSet or (CardSets.code eq cardSet)) and (CardSets.code eq Cards.setCode) })

        configureCardsInSet(selectOp) + getParentSetAnnoyingCards(set)
    }

    override fun getCardsInParentAndChildSetsWithUserCount(set: String, userId: String): List<CardDto> = transaction {
        val cardSet = originalSet(set)

        val selectOp = exists(CardSets.select { (CardSets.parentCode eq cardSet or (CardSets.code eq cardSet)) and (CardSets.code eq Cards.setCode) })

        configureCardsInSetWithUserCount(userId, selectOp) + getParentSetAnnoyingCardsWithUserCount(set, userId)
    }

    override fun getCardsInSetWithUserCount(set: String, userId: String): List<CardDto> = transaction {
        val functionToRun = { s: String ->
            val cardSet = originalSet(s)

            val refactorStep = selectOpOfFoilAndExtendedSets(s)
            val setSelect = Cards.setCode eq cardSet
            val selectOp = setSelect and refactorStep

            configureCardsInSetWithUserCount(userId, selectOp)
        }
        collectTheThings(set, functionToRun)
    }

    private fun selectOpOfFoilAndExtendedSets(set: String): Op<Boolean> {
        val isFoilSet = isFoilSet(set)
        val isExtendedSet = isExtendedSet(set)

        val isExtendedSetSelect = Cards.isExtendedSetCard eq isExtendedSet
        val isFoilSetSelect = Cards.isForcedFoilSet eq isFoilSet or when (isExtendedSet || isFoilSet) {
            true -> (Cards.hasFoil eq true) and (Cards.hasNonFoil eq false)
            false -> ((Cards.number notLike "%★") and (Cards.isForcedFoilSet eq false))
        }
        return isFoilSetSelect and isExtendedSetSelect
    }

    override fun getParentSetAnnoyingCards(set: String): List<CardDto> = transaction {
        val cardSet = originalSet(set)
        val regularCardTable = Cards.alias("regularCards")

        val parentSetsSelectOp = CardSets.slice(CardSets.code).select { (CardSets.parentCode eq cardSet or (CardSets.code eq cardSet)) }.map { it[CardSets.code] }
        val selectOp = (Cards.isPromo eq true) and (Cards.setCode notInList parentSetsSelectOp)

        val joinedTable = Cards.join(Identifiers, JoinType.LEFT, additionalConstraint = { Identifiers.cardId eq Cards.uuid })
            .join(CardPriceInfos, JoinType.LEFT, additionalConstraint = { CardPriceInfos.cardId eq Cards.uuid })
        try {
            joinedTable
                /* The exception to using configureCardsInSet */
                .join(regularCardTable, JoinType.INNER,
                    additionalConstraint = { (regularCardTable[Cards.name] eq Cards.name) and (regularCardTable[Cards.number] eq Cards.number) and (regularCardTable[Cards.setCode] eq cardSet) and (regularCardTable[Cards.isForcedFoilSet] eq false) })
                /* ends here */
                .join(CardSets, JoinType.LEFT, additionalConstraint = { CardSets.code eq Cards.setCode })
                .slice(Cards.columns + Identifiers.columns + CardPriceInfos.columns + cardSetsColumns())
                .select { selectOp }
                .map { it.mapToCardDto() }
        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }

    override fun getParentSetAnnoyingCardsWithUserCount(set: String, userId: String): List<CardDto> = transaction {
        val cardSet = originalSet(set)
        val regularCardTable = Cards.alias("regularCards")

        val parentSetsSelectOp = CardSets.slice(CardSets.code).select { (CardSets.parentCode eq cardSet or (CardSets.code eq cardSet)) }.map { it[CardSets.code] }
        val selectOp = (Cards.isPromo eq true) and (Cards.setCode notInList parentSetsSelectOp)

        val (joinedTable, nfcCountColumn, fcCountColumn) = withCardUserCount(userId)

        val joinedAgainTable = joinedTable.join(Identifiers, JoinType.LEFT, additionalConstraint = { Identifiers.cardId eq Cards.uuid })
            .join(CardPriceInfos, JoinType.LEFT, additionalConstraint = { CardPriceInfos.cardId eq Cards.uuid })
        try {
            joinedAgainTable
                /* The exception to using configureCardsInSet */
                .join(regularCardTable, JoinType.INNER,
                    additionalConstraint = { (regularCardTable[Cards.name] eq Cards.name) and (regularCardTable[Cards.number] eq Cards.number) and (regularCardTable[Cards.setCode] eq cardSet) and (regularCardTable[Cards.isForcedFoilSet] eq false) })
                /* ends here */
                .join(CardSets, JoinType.LEFT, additionalConstraint = { CardSets.code eq Cards.setCode })
                .slice(Cards.columns + Identifiers.columns + CardPriceInfos.columns + nfcCountColumn + fcCountColumn + cardSetsColumns())
                .select { selectOp }
                .map { it.mapToCardDto() }
        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }

    override fun getExcluded(): List<CardDto> = transaction {
        try {
            CardsExcluded
                .join(CardSets, JoinType.LEFT, additionalConstraint = { CardSets.code eq CardsExcluded.setCode })
                .slice(CardsExcluded.columns + cardSetsColumns()).selectAll().map { it.mapToCardExcludedDto() }
        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }

    private fun originalSet(set: String): String = set.replace("-f", "").replace("-e", "")
    private fun lowerCaseSet(set: String) = set.toLowerCase()
    private fun isFoilSet(set: String) = lowerCaseSet(set).contains("-f")
    private fun isExtendedSet(set: String) = lowerCaseSet(set).contains("-e")
}