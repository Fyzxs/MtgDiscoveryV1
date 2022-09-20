package ktor.auth

import ktor.model.users.PasswordUser
import org.mindrot.jbcrypt.BCrypt

object BcryptHasher {

    /**
     * Check if the password matches the User's password
     */
    fun checkPassword(attempt: String, user: PasswordUser) = if (BCrypt.checkpw(attempt, user.hash)) Unit
    else throw Exception("Wrong Password")

    /**
     * Returns the hashed version of the supplied password
     */
    fun hashPassword(password: String): String = BCrypt.hashpw(password, BCrypt.gensalt())

}