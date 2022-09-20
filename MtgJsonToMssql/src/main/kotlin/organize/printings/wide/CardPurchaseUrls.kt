package organize.printings.wide

import kotlinx.serialization.json.JsonElement
import organize.printings.stringOpt

data class CardPurchaseUrls(private val jsonElement: JsonElement?){
    val cardKingdom: String = jsonElement?.stringOpt("cardKingdom") ?: ""
    val cardKingdomFoil: String = jsonElement?.stringOpt("cardKingdomFoil") ?: ""
    val cardmarket: String = jsonElement?.stringOpt("cardmarket") ?: ""
    val tcgplayer: String = jsonElement?.stringOpt("tcgplayer") ?: ""
    fun isEmpty() : Boolean = cardKingdom.isEmpty() && cardKingdomFoil.isEmpty() && cardmarket.isEmpty() && tcgplayer.isEmpty()
}