package ktor.model

import kotlinx.serialization.Serializable

@Serializable
data class IdentifiersDto(
    val scryfallId: String,
    val multiverseId: String,
    val cardKingdomId: String,
    val cardKingdomFoilId: String
)

