package ktor.repository

import ktor.tables.CardSets
import ktor.tables.CardSuperTypes
import ktor.tables.Cards
import ktor.tables.users.UserCards
import ktor.tables.users.UserCards.leftJoin
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class ExposedCollectionRepository : CollectionRepository {

    private fun setCount() = Expression.build {
        val caseExpr = case()
            .When(UserCards.count.greater(0), intLiteral(1))
            .Else(intLiteral(0))
        Sum(caseExpr, IntegerColumnType()).alias("setCount")
    }

    private fun collectionCount() = Expression.build {
        val caseExpr = case()
            .When(UserCards.count.greater(0), UserCards.count)
            .Else(intLiteral(0))
        Sum(caseExpr, IntegerColumnType()).alias("collectionCount")
    }

    private fun collectionCountNoBasic(cardSuperTypesTable: CardSuperTypes) = Expression.build {
        val caseExpr = case()
            .When((UserCards.count.greater(0)) and ((CardSuperTypes.data neq "Basic") or (CardSuperTypes.data.isNull())), UserCards.count)
            .Else(intLiteral(0))
        Sum(caseExpr, IntegerColumnType()).alias("collectionCountNoBasic")
    }

    override fun getUserCollectionSummary(userId: String): UserCollectionSummaryDto {
        ////
        val userCollectionCount = getUserCollectionCount(userId)
        val totalCards = getTotalCardCount()
        val userSetCompletion = getUserSetCompletion(userId)

        return UserCollectionSummaryDto(
            collectionSetCardCount = userCollectionCount.collectionSetCardCount,
            collectionCount = userCollectionCount.collectionCount,
            collectionCountNoBasic = userCollectionCount.collectionCountNoBasic,
            totalCardCount = totalCards.totalCardCount,
            totalSets = userSetCompletion.totalSets,
            completedSets = userSetCompletion.completedSets
        )
    }

    override fun getTotalCardCount(): TotalKnownCardsDto = transaction {
        try {
            val count = Cards.name.count().alias("count")

            Cards.slice(count).selectAll().map { TotalKnownCardsDto(it[count]) }[0]

        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }

    private fun getUserCollectionCount(userId: String): CollectionCountDto = transaction {
        try {
            val setCount = setCount()
            val collectionCount = collectionCount()
            val collectionCountNoBasic = collectionCountNoBasic(CardSuperTypes)

            UserCards
                .leftJoin(CardSuperTypes, { cardUuid }, { cardId })
                .slice(setCount, collectionCount, collectionCountNoBasic)
                .select { (UserCards.userUuid eq userId) and (UserCards.count.isNotNull()) }
                .map {
                    CollectionCountDto(
                        collectionSetCardCount = it[setCount] ?: 0,
                        collectionCount = it[collectionCount] ?: 0,
                        collectionCountNoBasic = it[collectionCountNoBasic] ?: 0
                    )
                }[0]
        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }

    private fun getUserSetCompletion(userId: String): SetCompletionCountDto = transaction {
        //TODO: This is copied from SetRespository. It can be cleaned up for this purpose
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

        val list: MutableList<Boolean> = mutableListOf()
        try {
            CardSets.join(subQuery, JoinType.LEFT, additionalConstraint = {
                (
                        CardSets.actualType eq subQuery[UserCards.setType]) and
                        ((subQuery[UserCards.setCode] eq CardSets.code) /*or (subQuery[UserCards.setCode] eq CardSets.parentCode)*/ or (subQuery[UserCards.setCode] eq CardSets.actualCode) or
                                ((subQuery[UserCards.setType] eq "token") and (subQuery[UserCards.isForcedFoilSet] eq true) and (subQuery[UserCards.setCode] + "-F" eq CardSets.code))) and
                        ((subQuery[UserCards.isForcedFoilSet] eq CardSets.isForcedFoilSet) or (subQuery[UserCards.isFoilOnly] eq true)) and
                        (subQuery[UserCards.isForcedExtendedSet] eq CardSets.isForcedExtendedSet)
            })
                .slice(CardSets.columns + subQuery[ofSet] + subQuery[collected],)
                .selectAll()
                .map {
                    list.add(it[subQuery[ofSet]] == it[CardSets.calculatedSetSize])
                }

            SetCompletionCountDto(list.count(), list.count { it })

        } catch (cause: Throwable) {
            val msg = cause.message
            throw cause
        }
    }
}