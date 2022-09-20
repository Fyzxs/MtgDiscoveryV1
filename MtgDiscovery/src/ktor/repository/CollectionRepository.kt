package ktor.repository

import kotlinx.serialization.Serializable

interface CollectionRepository {
    fun getTotalCardCount(): TotalKnownCardsDto
    fun getUserCollectionSummary(userId: String): UserCollectionSummaryDto
}

@Serializable
data class UserCollectionSummaryDtoWrapper(
    val data: UserCollectionSummaryDto
)

@Serializable
data class TotalKnownCardsDtoWrapper(
    val data: TotalKnownCardsDto
)


@Serializable
data class UserCollectionSummaryDto(
    val collectionSetCardCount: Int,
    val collectionCount: Int,
    val collectionCountNoBasic: Int,
    val totalCardCount: Long,
    val totalSets: Int,
    val completedSets: Int
)

@Serializable
data class CollectionCountDto(
    val collectionSetCardCount: Int,
    val collectionCount: Int,
    val collectionCountNoBasic: Int
)

@Serializable
data class TotalKnownCardsDto(
    val totalCardCount: Long
)

@Serializable
data class SetCompletionCountDto(
    val totalSets: Int,
    val completedSets: Int
)