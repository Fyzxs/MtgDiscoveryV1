package ktor.tables

import org.jetbrains.exposed.sql.Table

object CardSuperTypes : Table("CardSuperTypes"){
    val cardId = varchar("cardId", 1024)
    val data = varchar("data", 1024)
}