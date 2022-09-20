package ktor.repository

import io.ktor.util.*
import ktor.model.CardSetDto
import ktor.tables.CardSets
import ktor.tables.CardSetsExcluded
import ktor.tables.users.UserCards
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.isNotNull
import org.jetbrains.exposed.sql.transactions.transaction

class ExposedSetRepository : SetRepository {

    private fun withSetUserCount(userId: String): Triple<QueryAlias, ExpressionAlias<Int?>, ExpressionAlias<Int?>> {
        val ofSet = Expression.build {
            val caseExpr = case()
                .When(UserCards.count.greater(0), intLiteral(1))
                .Else(intLiteral(0))
            Sum(caseExpr, IntegerColumnType())
        }.alias("ofSet")
        val collected = Expression.build { Sum(UserCards.count, IntegerColumnType()) }.alias("collected")
        val subQuery = UserCards
            .slice(UserCards.setType, UserCards.setCode, UserCards.isForcedFoilSet, UserCards.isForcedExtendedSet, UserCards.isFoilOnly, ofSet, collected)
            .select { UserCards.userUuid eq userId }
            .groupBy(UserCards.setType, UserCards.setCode, UserCards.isForcedFoilSet, UserCards.isForcedExtendedSet, UserCards.isFoilOnly)
            .alias("userCounts")

        return Triple(subQuery, ofSet, collected)
    }

    private fun configureAllSetsWithUserCount(userId: String, selectOp: Op<Boolean>): List<CardSetDto> = transaction {
        val (subQuery, ofSet, collected) = withSetUserCount(userId)
        try {
            CardSets.join(subQuery, JoinType.LEFT, additionalConstraint = {
                (
                        CardSets.actualType eq subQuery[UserCards.setType]) and
                        ((subQuery[UserCards.setCode] eq CardSets.code) /*or (subQuery[UserCards.setCode] eq CardSets.parentCode)*/ or (subQuery[UserCards.setCode] eq CardSets.actualCode) or
                                ((subQuery[UserCards.setType] eq "token") and (subQuery[UserCards.isForcedFoilSet] eq true) and (subQuery[UserCards.setCode] + "-F" eq CardSets.code))) and
                        ((subQuery[UserCards.isForcedFoilSet] eq CardSets.isForcedFoilSet) or (subQuery[UserCards.isFoilOnly] eq true)) and
                        (subQuery[UserCards.isForcedExtendedSet] eq CardSets.isForcedExtendedSet)
            })
                .slice(CardSets.columns + subQuery[ofSet] + subQuery[collected])
                .select { selectOp }
                .orderBy(CardSets.code)
                .map {
                    it.mapToCardSetDto().copy(
                        ofSet = it[subQuery[ofSet]] ?: 0,
                        collected = it[subQuery[collected]] ?: 0
                    )
                }
                .fold(mutableListOf()) { acc, cardSetDto ->
                    //Fold handles the case of the `isFoilOnly` cards causing 2 set results
                    val found = acc.find { it.code == cardSetDto.code }
                    if(found == null){
                        acc.add(cardSetDto)
                    } else{
                        acc.remove(found)
                        acc.add(cardSetDto.copy(ofSet = cardSetDto.ofSet + found.ofSet, collected = cardSetDto.collected + found.collected) )
                    }
                    acc
                }
        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }

    private fun configureAllSets(selectOp: Op<Boolean>): List<CardSetDto> = transaction {

        CardSets
            .select { selectOp }
            .withDistinct() //This is a shitty hack; there should be some SQL to deduce it
            .map { it.mapToCardSetDto() }
    }

    override fun getAllSets(): List<CardSetDto> = transaction {
        configureAllSets(Op.TRUE)
    }

    override fun getAllSetsWithUserCount(userId: String): List<CardSetDto> = transaction {
        configureAllSetsWithUserCount(userId, Op.TRUE)
    }

    override fun getParentAndChildSets(set: String): List<CardSetDto> = transaction {
        configureAllSets((CardSets.parentCode eq set) or setCodeSelector(set))
    }

    override fun getParentAndChildSetsWithUserCount(set: String, userId: String): List<CardSetDto> = transaction {
        configureAllSetsWithUserCount(userId, (CardSets.parentCode eq set) or setCodeSelector(set))
    }

    override fun getSet(set: String): List<CardSetDto> = transaction {
        val functionToRun = { s: String ->
            val list = configureAllSets(setCodeSelector(s))
            //reduce handles the case of the `isFoilOnly` cards causing 2 set results
            listOf(list.reduce { acc, cardSetDto -> cardSetDto.copy(ofSet = cardSetDto.ofSet + acc.ofSet, collected = cardSetDto.collected + acc.collected) })
        }
        collectTheThings(set, functionToRun)
    }

    override fun getSetWithUserCount(set: String, userId: String): List<CardSetDto> = transaction {
        val functionToRun = { s: String -> configureAllSetsWithUserCount(userId, setCodeSelector(s)) }
        collectTheThings(set, functionToRun)
    }

    override fun getExcluded(): List<CardSetDto> = transaction {
        try {
            CardSetsExcluded.slice(CardSetsExcluded.columns).selectAll().map { it.mapToCardSetExcludedDto() }
        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }


    private fun <T> collectTheThings(set: String, functionToRun: (String) -> List<T>): List<T> {
        val list: MutableList<T> = mutableListOf()
        set.split(",").forEach { list += functionToRun(it) }
        return list.distinct()
    }

    private fun setCodeSelector(set: String): Op<Boolean> {
        return CardSets.code eq set
    }

}