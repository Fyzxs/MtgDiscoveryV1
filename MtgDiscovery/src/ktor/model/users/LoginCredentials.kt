package ktor.model.users

import kotlinx.serialization.Serializable

@Serializable
data class LoginCredentials(
    val displayName: String,
    val password: String
)
@Serializable
class CredentialWrapper(val user: LoginCredentials)