
import Because.actualCommandToRunWideData
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.jsonObject
import org.joda.time.DateTime
import organize.WriteOut
import organize.printings.string
import java.net.URL
import java.util.*
import kotlin.math.roundToInt

fun main(args: Array<String>) {
    val prices = args.isNotEmpty() && args[0] == "prices"
    val sets = args.isNotEmpty() && args[0] == "sets"
    val images = args.isNotEmpty() && args[0] == "images"

    println("Prices state [$prices]")
    println("Sets state [$sets]")
    println("Images state [$images]")

    val sb = "---Write Fresh File ${DateTime.now().toDateTimeISO()}"
    when {
        sets -> {
            WriteOut.writePrimary(sb)
            organize.printings.processPrintings(false)
        }
        images -> {
            WriteOut.toDownload(sb)
            organize.printings.processPrintings(true)
        }
        prices -> {
            WriteOut.writePrices(sb)
            processPrices()
        }
    }
}

data class CardPriceInfo(
    val averageFoil: Float,
    val averageRegular: Float,
    val latestFoil : Float,
    val latestRegular : Float
)

fun processPrices(){
    println("Processing prices")
//    val hash = URL("https://mtgjson.com/api/v5/AllPrices.json.sha256").readText()
//    val hashCommand = actualCommandToRunCardSetProcessedHash(Because.CardSetProcessedHash("AllPrints", hash))
////        if(hashCommand.isBlank()) {
////            println("All Printings Hash is already in the database - not reprocessing")
////            return
////        }
//    WriteOut.writePrimary(hashCommand)
    val json = URL("https://mtgjson.com/api/v5/AllPrices.json").readText()
    val result = Json.parseToJsonElement(json)

    val data = result.jsonObject["data"]
    val cards = data?.jsonObject
    val count = cards?.count() ?: return
    var ctr = 0
    cards.forEach cards@{
        println("${ctr++.toString().padStart(5)} of $count being processed")
        val noPrice = ""
        val cardId = UUID.fromString(it.key)
        val types = it.value.jsonObject
        val paper = types["paper"] ?: return@cards
        val cardkingdom = paper.jsonObject["cardkingdom"] ?: return@cards
        val currency = cardkingdom.string("currency")
        if (currency != "USD") return@cards
        val retail = cardkingdom.jsonObject["retail"] ?: return@cards
        //Normal
        val normalPrice = createNormalPrice(retail)
        val foilPrice = createFoilPrice(retail)

        val data1 = CardPriceInfo(foilPrice.first, normalPrice.first, foilPrice.second, normalPrice.second )

        val command = actualCommandToRunWideData(cardId, data1)
        WriteOut.writePrices(command)
    }

    println("price generation done")
}

private fun createNormalPrice(retail: JsonElement): Pair<Float, Float> {
    return calcInfo(retail.jsonObject["normal"] ?: return 0f to 0f)
}

private fun createFoilPrice(retail: JsonElement) : Pair<Float, Float> {
    return calcInfo(retail.jsonObject["foil"] ?: return 0f to 0f)
}

private fun calcInfo(normal: JsonElement): Pair<Float, Float> {
    var latest = 0f;
    var count = 0;
    var sum = 0f;
    normal.jsonObject.forEach { t, u ->
        latest = u.toString().toFloat()
        sum += latest
        count++
    }
    val avg = ((((sum  * 100)/ count)).roundToInt() / 100f)
    return Pair(avg, latest)
}
