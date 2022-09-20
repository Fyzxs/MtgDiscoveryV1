package organize.printings.wide

import kotlinx.serialization.json.JsonElement
import organize.printings.stringOpt

data class Identifiers(private val jsonElement: JsonElement){
    val cardKingdomFoilId : String = jsonElement.stringOpt("cardKingdomFoilId")
    val cardKingdomId : String = jsonElement.stringOpt("cardKingdomId")
    val mcmId : String = jsonElement.stringOpt("mcmId")
    val mcmMetaId : String = jsonElement.stringOpt("mcmMetaId")
    val mtgArenaId : String = jsonElement.stringOpt("mtgArenaId")
    val mtgoFoilId : String = jsonElement.stringOpt("mtgoFoilId")
    val mtgoId : String = jsonElement.stringOpt("mtgoId")
    val mtgjsonV4Id : String = jsonElement.stringOpt("mtgjsonV4Id")
    val multiverseId : String = jsonElement.stringOpt("multiverseId")
    val scryfallId : String = jsonElement.stringOpt("scryfallId")
    val scryfallOracleId : String = jsonElement.stringOpt("scryfallOracleId")
    val scryfallIllustrationId : String = jsonElement.stringOpt("scryfallIllustrationId")
    val tcgplayerProductId : String = jsonElement.stringOpt("tcgplayerProductId")
}