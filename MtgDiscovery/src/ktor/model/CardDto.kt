package ktor.model

import kotlinx.serialization.Serializable

@Serializable
data class CardDto(
    val artist: String,
    val uuid: String,
    val name: String,
    val rarity: String,
    val setCode: String,
    val keyRuneCode: String,
    val faceName: String,
    val number: String,
    val isPromo: Boolean,
    val hasFoil: Boolean,
    val hasNonFoil: Boolean,
    val identifiers: IdentifiersDto,
    val side: String,
    val isExtendedCardSet: Boolean,
    val isForcedFoilSet: Boolean,
    val countNonFoil: Int,
    val countFoil: Int,
    val layout: String,
    val setType: String,
    // Joined with Set
    val setName: String,
    val setReleaseDate: String,
    //Join with Prices
    val prices:CardPriceInfoDto
)