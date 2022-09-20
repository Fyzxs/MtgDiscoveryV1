package ktor.tables

import org.jetbrains.exposed.sql.Table

object Cards: CardsTable("Card")
object CardsExcluded: CardsTable("Card_Excluded")

abstract class CardsTable(name:String): Table(name){
    val artist = varchar("artist", 1024)
    val name = varchar("name", 1024)
    val rarity = varchar("rarity", 1024)
    val setCode = varchar("setCode", 1024)
    val keyRuneCode = varchar("keyRuneCode", 1024)
    val number = varchar("number", 1024)
    val faceName = varchar("faceName", 1024)
    val uuid = uuid("uuid")
    val hasFoil = bool("hasFoil")
    val hasNonFoil = bool("hasNonFoil")
    val isPromo = bool("isPromo")
    val side = varchar("side", 2014)
    val isExtendedSetCard = bool("isExtendedSetCard")
    val isForcedFoilSet = bool("isForcedFoilSet")
    val setType = varchar("setType", 1024)
    val layout = varchar("layout", 2014)
}