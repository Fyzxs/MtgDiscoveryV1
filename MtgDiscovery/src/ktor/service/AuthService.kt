package ktor.service

import ktor.auth.JwtConfig
import ktor.auth.BcryptHasher
import ktor.auth.UserNotFound
import ktor.model.users.*
import ktor.repository.UserRepository

class AuthService(private val db: UserRepository) {

    fun login(credentials: LoginCredentials): AuthNUser = credentials.let { (email, password) ->
        val user = db.findUser(email) ?: throw UserNotFound
        BcryptHasher.checkPassword(password, user)
        val token = JwtConfig.makeToken(user)
        return AuthNUser(user.uuid, user.displayName, token)
    }

    fun register(details: UnsafeRegistrationDetails): AuthNUser {
        val hashedRegistration = details.hashed()
        db.insertUser(hashedRegistration)
        return db.findUser(hashedRegistration.displayName)!!.run {
            return AuthNUser(uuid, displayName, JwtConfig.makeToken(this))
        }
    }

    private fun UnsafeRegistrationDetails.hashed(): HashedRegistrationDetails {
        return HashedRegistrationDetails(
            displayName = displayName,
            hash = BcryptHasher.hashPassword(password)
        )
    }
}