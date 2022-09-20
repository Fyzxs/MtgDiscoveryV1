package ktor.model

import kotlinx.serialization.Serializable

@Serializable
data class CardSetDto(
    val baseSetSize: Int,
    val block: String,
    val code: String,
    val actualCode: String,
    val keyruneCode: String,
    val name: String,
    val parentCode: String,
    val releaseDate: String,
    val totalSetSize: Int,
    val type: String,
    val actualType: String,
    val ofSet: Int,
    val collected: Int,
    val isPartialPreview: Boolean,
    val calculatedSetSize : Int
)