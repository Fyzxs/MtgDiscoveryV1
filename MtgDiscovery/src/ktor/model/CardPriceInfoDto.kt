package ktor.model

import kotlinx.serialization.Serializable

@Serializable
data class CardPriceInfoDto(
    val averageFoil: Double,
    val averageRegular: Double,
    val latestFoil: Double,
    val latestRegular: Double,
)