package ktor.tables

import org.jetbrains.exposed.sql.Table

object Identifiers: Table("Identifiers"){
    val cardId = uuid("cardId")
    val scryfallId = varchar("scryfallId", 1024)
    val multiverseId = varchar("multiverseId", 1024)
    val cardKingdomId = varchar("cardKingdomId", 1024)
    val cardKingdomFoilId = varchar("cardKingdomFoilId", 1024)
}
object CardPriceInfos: Table("CardPriceInfo"){
    val cardId = uuid("cardId").nullable()
    val averageFoil = decimal("averageFoil", 18,2).nullable()
    val averageRegular = decimal("averageRegular", 18,2).nullable()
    val latestFoil = decimal("latestFoil", 18,2).nullable()
    val latestRegular = decimal("latestRegular", 18,2).nullable()
}