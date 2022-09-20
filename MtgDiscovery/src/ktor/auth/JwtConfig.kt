package ktor.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import config.ConfigManager
import ktor.model.users.AuthNUser
import ktor.model.users.PasswordUser
import java.util.*

object JwtConfig {

    private val secret = ConfigManager.authConfig.secret
    private val issuer = ConfigManager.authConfig.issuer
    val realm = ConfigManager.authConfig.realm
    private val validityInMs = ConfigManager.authConfig.validityInMs
    private val algorithm = Algorithm.HMAC256(secret)

    val verifier: JWTVerifier = JWT.require(algorithm)
        .withIssuer(issuer)
        .build()

    /**
     * Produce a token for this combination of User and Account
     */
    fun makeToken(user: PasswordUser): String {
        val uuid = user.uuid
        val displayName = user.displayName
        return makeToken(uuid, displayName)
    }
    fun makeToken(user: AuthNUser): String {
        val uuid = user.uuid
        val displayName = user.displayName
        return makeToken(uuid, displayName)
    }

    private fun makeToken(uuid: String, displayName: String): String {
        return JWT.create()
            .withSubject("Authentication")
            .withIssuer(issuer)
            .withClaim("id", uuid)
            .withClaim("displayName", displayName)
            .withExpiresAt(getExpiration())
            .sign(algorithm)
    }

    /**
     * Calculate the expiration Date based on current time + the given validity
     */
    private fun getExpiration() = Date(System.currentTimeMillis() + validityInMs)

}