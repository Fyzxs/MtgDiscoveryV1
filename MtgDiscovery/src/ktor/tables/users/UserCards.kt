package ktor.tables.users

import org.jetbrains.exposed.sql.Table


object UserCards : Table("UserCards") {
    val userUuid = varchar("UserUuid", 1204)
    val cardUuid = varchar("CardUuid", 1204)
    val isForcedFoilSet = bool("isForcedFoilSet")
    val isForcedExtendedSet = bool("isForcedExtendedSet")
    val isFoilOnly = bool("isFoilOnly")
    val setCode = varchar("setCode", 1024)
    val count = integer("Count").nullable()
    val setType = varchar("setType", 1024)
}
