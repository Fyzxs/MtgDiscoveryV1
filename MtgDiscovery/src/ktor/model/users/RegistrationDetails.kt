package ktor.model.users

import kotlinx.serialization.Serializable

@Serializable
data class UnsafeRegistrationDetails(
    val displayName: String,
    val password: String
)

@Serializable
data class HashedRegistrationDetails(
    val displayName: String,
    val hash: String
)

@Serializable
class RegistrationWrapper(val user: UnsafeRegistrationDetails)