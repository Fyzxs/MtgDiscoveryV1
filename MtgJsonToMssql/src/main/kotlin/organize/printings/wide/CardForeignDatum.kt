package organize.printings.wide

import kotlinx.serialization.json.JsonElement
import organize.printings.string
import organize.printings.stringOpt

data class CardForeignDatum(private val jsonElement: JsonElement){
    val faceName: String = jsonElement.stringOpt("faceName")
    val flavorText: String = jsonElement.stringOpt("flavorText")
    val language: String = jsonElement.string("language")
    val multiverseId: String = jsonElement.stringOpt("multiverseId")
    val name: String = jsonElement.string("name")
    val text: String = jsonElement.stringOpt("text")
    val type: String = jsonElement.stringOpt("type")
}