package ktor.tables.users

import org.jetbrains.exposed.dao.id.IntIdTable

object Users : IntIdTable("Users") {
    val uuid = varchar("UserId", 1204)
    val hash = varchar("Hash", 1024)
    val displayName = varchar("DisplayName", 1024)
}