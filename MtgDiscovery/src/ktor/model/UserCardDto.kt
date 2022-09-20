package ktor.model

import kotlinx.serialization.Serializable

@Serializable
data class UserCardDto(
    val userUuid :String,
    val cardUuid :String,
    val setCode :String,
    val setType :String,
    val isForcedFoilSet :Boolean,
    val isForcedExtendedSet : Boolean,
    val count :Int,
    val isFoilOnly: Boolean
) {
}