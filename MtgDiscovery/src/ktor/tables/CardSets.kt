package ktor.tables

import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.jodatime.date
import org.joda.time.DateTime

object CardSets: CardSetsTable("CardSet")
object CardSetsExcluded: CardSetsTable("CardSet_Excluded")

abstract class CardSetsTable(name:String): Table(name){
    val baseSetSize = integer("baseSetSize")
    val block = varchar("block", 1024)
    val code = varchar("code", 1024)
    val actualCode = varchar("actualCode", 1024)
    val actualType = varchar("actualType", 1024)
    val isPartialPreview = bool("isPartialPreview")
    val keyruneCode = varchar("keyruneCode", 1024)
    val name = varchar("name", 1024)
    val parentCode = varchar("parentCode", 1024)
    val releaseDate = date("releaseDate")
    val totalSetSize = integer("totalSetSize")
    val type = varchar("type", 1024)
    val isForcedExtendedSet = bool("isForcedExtendedSet")
    val isForcedFoilSet = bool("isForcedFoilSet")
    val calculatedSetSize = integer("calculatedSetSize")
}
