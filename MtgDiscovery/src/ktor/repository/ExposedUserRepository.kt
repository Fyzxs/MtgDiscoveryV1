package ktor.repository

import ktor.auth.UserAlreadyExists
import ktor.model.users.HashedRegistrationDetails
import ktor.model.users.PasswordUser
import ktor.model.users.PublicUser
import ktor.tables.users.Users
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

class ExposedUserRepository : UserRepository {

    override fun findUser(displayName: String): PasswordUser? = findUser(byEmail(displayName))

    fun findUser(where: Op<Boolean>) = transaction {
        Users.select(where)
            .firstOrNull()
            ?.let(ResultRow::toUser)
    }

    fun byEmail(displayName: String): Op<Boolean> = Users.displayName eq displayName

    override fun insertUser(details: HashedRegistrationDetails): Int = transaction {
        val alreadyExists = Users.select { Users.displayName eq details.displayName }
            .firstOrNull() != null
        if (alreadyExists) throw UserAlreadyExists

        return@transaction Users.insertAndGetId {
            it[hash] = details.hash
            it[displayName] = details.displayName
        }.value
    }

    override fun getPublicUserDataByUserId(uuid: String) = transaction {
        Users.select { Users.uuid eq uuid }
            .firstOrNull()
            ?.let(ResultRow::toPublicUser)
    }

    override fun getPublicUserDataByDisplayName(displayName: String): PublicUser? = transaction {
        Users.select { Users.displayName eq displayName }
            .firstOrNull()
            ?.let(ResultRow::toPublicUser)
    }
}