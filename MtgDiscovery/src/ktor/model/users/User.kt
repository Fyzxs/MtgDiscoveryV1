package ktor.model.users

import io.ktor.auth.*
import kotlinx.serialization.Serializable

@Serializable
data class PublicUser(
    val uuid : String,
    val displayName: String
)
@Serializable
class PublicUserWrapper(val user: PublicUser)

@Serializable
data class PasswordUser(
    val uuid : String,
    val displayName: String,
    val hash: String,
) : Principal

@Serializable
data class AuthNUser(
    val uuid : String,
    val displayName: String,
    val token: String
) : Principal
@Serializable
class AuthNUserWrapper(val user: AuthNUser)