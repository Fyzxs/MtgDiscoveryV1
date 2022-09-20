package organize.printings

import Because
import Because.actualCommandToRunCardSetProcessedHash
import kotlinx.serialization.json.Json
import organize.AllPrintings
import organize.CardSupertypes
import organize.WriteOut
import organize.printings.wide.*
import java.net.URL
import java.util.concurrent.atomic.AtomicInteger

const val UnSeriesCharacter = "★"
const val MisprintCharacter = "†"//Maybe? Seems to be attached to oddities


val excludedNumberSuffixCharacters = arrayOf(UnSeriesCharacter, MisprintCharacter)

fun downloadCard(cardIt: Card) {
    downloadDefault(cardIt)
//    downloadArt(cardIt)
//    downloadLarge(cardIt)
//    downloadNormal(cardIt)
//    downloadSmall(cardIt)
//    downloadBorderCrop(cardIt)
}
fun downloadDefault(cardIt: Card) {
    //TODO: Obsolete once code uses "_version"
    val record = "cards/${cardIt.uuid}.jpg,https://api.scryfall.com/cards/${cardIt.identifiers.scryfallId}?format=image"
    WriteOut.toDownload(record)
    downloadDefaultBack(cardIt)
}

fun downloadArt(cardIt: Card) = downloadVersioned(cardIt, "art_crop")
fun downloadLarge(cardIt: Card) = downloadVersioned(cardIt, "large")
fun downloadNormal(cardIt: Card) = downloadVersioned(cardIt, "normal")
fun downloadSmall(cardIt: Card) = downloadVersioned(cardIt, "small")
fun downloadBorderCrop(cardIt: Card) = downloadVersioned(cardIt, "border_crop")

fun downloadVersioned(cardIt:Card, version:String){
    downloadVersionedFront(cardIt, version)
    downloadVersionedBack(cardIt, version)
}
fun downloadVersionedFront(cardIt:Card, version:String){
    val record = "cards/${cardIt.uuid}_${version}.jpg,https://api.scryfall.com/cards/${cardIt.identifiers.scryfallId}?format=image&face=front&version=${version}"
    WriteOut.toDownload(record)
}
fun downloadVersionedBack(cardIt:Card, version:String){
    if (cardIt.hasOtherFaceIds.not()) return
    if (cardIt.layout != "modal_dfc" && cardIt.layout != "transform") return

    val record = "cards/${cardIt.uuid}_${version}_back.jpg,https://api.scryfall.com/cards/${cardIt.identifiers.scryfallId}?format=image&face=back&version=${version}"
    WriteOut.toDownload(record)
}

fun downloadDefaultBack(cardIt: Card) {
    if (cardIt.hasOtherFaceIds.not()) return
    if (cardIt.layout != "modal_dfc" && cardIt.layout != "transform") return

    val record = "cards/${cardIt.uuid}_back.jpg,https://api.scryfall.com/cards/${cardIt.identifiers.scryfallId}?format=image&face=back"
    WriteOut.toDownload(record)
}

class ProcessingOptions {
    val blockExcept = "STA"
    val bypassAlreadyProcessedCheck = true
    val isUpdate = false

    fun shouldSkip(setIt: CardSet, processingSet: String): Boolean {
        return false
        if (isUpdate.not()) {

            if (setIt.code != blockExcept) {
                println("$processingSet is skipped")
                return true//This will block everything EXCEPT the specified set
            }

            if (bypassAlreadyProcessedCheck.not() && setAlreadyProcessed(setIt)) {
                println("$processingSet is already processed, skipping")
                return true
            }
        }
        return false
    }
}

fun processPrintings(imagesOnly: Boolean) {
    if (WriteOut.dropTables) {
        println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        println("WARNING : DROP TABLES IS ENABLED")
        println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        while (true) {
            println("Q: Quit")
            println("C: Continue")
            println("anything else gets you back here")
            val input = readLine()?.toUpperCase()
            when (input) {
                "Q" -> return
                "C" -> break
            }
        }
    }

    if (imagesOnly) println("This will be image processing only")

    try {
        scriptTables()
        val hash = URL("https://mtgjson.com/api/v5/AllPrintings.json.sha256").readText()
        val hashCommand = actualCommandToRunCardSetProcessedHash(Because.CardSetProcessedHash("AllPrints", hash))
        if (hashCommand.isBlank()) {
            println("All Printings Hash is already in the database.")
            println("Ignoring that we can skip this.")
            //return
        }
        WriteOut.writePrimary(hashCommand)

        val json = URL("https://mtgjson.com/api/v5/AllPrintings.json").readText()
        //val json = File("E:\\Downloads\\PL21.json").readText()
        val result = Json.parseToJsonElement(json)
        val all = AllPrintings(result)
        val sets = all.items().sortedBy { it.name }
        val setCount = sets.count()
        val setCounter = AtomicInteger()
        val processingOptions = ProcessingOptions()
        println("Processing $setCount sets")
        sets.forEach { setIt ->

            val processingSet = "${setIt.code.padEnd(5)}: ${setIt.actualname.padEnd(41)} : ${setCounter.addAndGet(1).toString().padStart(3)} / $setCount"
            setIt.cards.forEach {
                downloadCard(it)
            }
            setIt.tokens.forEach {
                downloadCard(it)
            }
            if (imagesOnly) {
                println(processingSet)
                return@forEach
            }


            if (processingOptions.shouldSkip(setIt, processingSet)) return@forEach

            if (setIt.isPartialPreview) return@forEach // Do not process PreRelease Stuff
            if (setIt.shouldNotProcessSet()) {
                println("EXCLUDING SET $processingSet")
                WriteOut.writeExcluded(Because.actualCommandToRunCardSet(setIt, "_Excluded"))
                return@forEach
            }

            val regularSet = createRegularSet(setIt)
            val foilRegularSet = createFoilRegularSet(setIt)
            val extendedSet = createExtendedSet(setIt)
            val foilExtendedSet = createFoilExtendedSet(setIt)
            val tokenSet = createTokenSet(setIt)
            val foilTokenSet = createFoilTokenSet(setIt)

            val listOf = listOf(regularSet, foilRegularSet, extendedSet, foilExtendedSet, tokenSet, foilTokenSet)
            listOf.forEach { writeOutSetInfo(it) }

            val allCardsWithDuplications = listOf.flatMap { it.cards }.filter { ignoreCard(it) }
            val distinctUuids = allCardsWithDuplications.distinctBy { it.uuid }
            distinctUuids.forEach { writeOutCardDetails(it, processingSet) }
            val distinctCards = allCardsWithDuplications.distinctBy { "${it.uuid}_${it.isForcedFoilSet}_${it.isExtendedSetCard}" }
            distinctCards.forEach { writeOutCardInfo(it, processingSet) }

            writeOutExcludedCardDetails(createExcludedSet(setIt), processingSet)

        }

        WriteOut.close()
        WriteOut.actualLocation()
        println("sleeping for a couple seconds")
        Thread.sleep(2000)

//    PrintStuff()
    } catch (cause: Throwable) {
        println(cause.stackTraceToString())
        println(cause.message)
    }
    return
}

fun ignoreCard(it: Card): Boolean {
    return it.isOnlineOnly.not()
}

private fun setAlreadyProcessed(setIt: CardSet): Boolean {
    val hash = URL("https://mtgjson.com/api/v5/${setIt.actualCode}.json.sha256").readText()
    val setCommand = Because.actualCommandToRunCardSetExists(setIt)
    val hashUpdate = actualCommandToRunCardSetProcessedHash(Because.CardSetProcessedHash(setIt.actualCode, hash))
    val setAlreadyExists = setCommand.isBlank()
    val hashExists = hashUpdate.isBlank()

    val setProcessed = setAlreadyExists && hashExists

    if (!hashExists) WriteOut.writePrimary(hashUpdate)
    return setProcessed
}


private fun writeOutSetInfo(setIt: CardSet) {
    if (setIt.shouldNotProcessSet()) {
        return
    }
    WriteOut.writePrimary(Because.actualCommandToRunCardSet(setIt))
}

private fun writeOutCardInfo(cardIt: Card, blurb: String) {
    println("$blurb - primary card info for ${cardIt.name}")
    WriteOut.writePrimary(Because.actualCommandToRunCard(cardIt))
}

private fun writeOutExcludedCardDetails(excludedSet: ExcludedSet, blurb: String) {
    excludedSet.cards.forEach {
        println("$blurb - excluded card for ${it.name}")
        WriteOut.writeExcluded(Because.actualCommandToRunCard(it, "_Excluded"))
    }
}

private fun writeOutCardDetails(cardIt: Card, blurb: String) {
    print("$blurb - inc extra card info for ${cardIt.name}")

    cardIt.supertypes.items().forEach { subIt -> WriteOut.writePrimary(Because.actualCommandToRunNarrowData(CardSupertypes::class, cardIt.uuid, subIt)) }
    print(".")
    WriteOut.writePrimary(Because.actualCommandToRunWideData(cardIt.uuid, cardIt.identifiers))
    print(".")
    println()
}

private fun createRegularSet(setIt: CardSet): CardSet {
    return RegularSet(setIt)
}

private fun createFoilRegularSet(setIt: CardSet): CardSet {
    if (shouldNotCreateFoilSets(setIt)) {
        return NullObjectSet(setIt)
    }

    return FoilRegularSet(setIt)
}

private fun createExtendedSet(setIt: CardSet): CardSet {
    return ExtendedSet(setIt)
}

private fun createFoilExtendedSet(setIt: CardSet): CardSet {
    return FoilExtendedSet(setIt)
}

private fun createTokenSet(setIt: CardSet): CardSet {
    return TokenSet(setIt)
}

private fun createFoilTokenSet(setIt: CardSet): CardSet {
    if (shouldNotCreateFoilSets(setIt)) {
        return NullObjectSet(setIt)
    }
    return FoilTokenSet(setIt)
}

private fun createExcludedSet(setIt: CardSet): ExcludedSet {
    return ExcludedSet(setIt)
}

fun shouldNotProcessCardAtAll(cardIt: Card): Boolean {
    return shouldNotProcessSpecificNumberSuffix(cardIt) || shouldNotProcessAsForeignPrint(cardIt)
}

fun shouldNotProcessAsForeignPrint(cardIt: Card): Boolean {
    return cardIt.setType != "promo" && cardIt.number.endsWith("s")
}

fun shouldNotProcessSpecificNumberSuffix(cardIt: Card): Boolean {
    return cardIt.setType != "promo" && excludedNumberSuffixCharacters.any { cardIt.number.endsWith(it) }
}

fun shouldNotCreateFoilSets(it: CardSet): Boolean {
    if (it.name.startsWith("World Championship Decks")) return true // These are just weird... don't bother with them as a foil set

    return false
}

//Narrow Data Tables
//    cardIt.variations.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardVariations::class, cardIt.uuid, subIt)) } // Not using, but probably useful
//    print(".")
//    cardIt.availability.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardAvailabilities::class, cardIt.uuid, subIt)) } // Probably don't need
//    print(".")
//    cardIt.colorIdentity.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardColorIdentities::class, cardIt.uuid, subIt)) } // Probably don't need
//    print(".")
//    cardIt.colorIndicator.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardColorIndicators::class, cardIt.uuid, subIt)) } // Probably don't need
//    print(".")
//    cardIt.colors.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardColors::class, cardIt.uuid, subIt)) } // Probably don't need
//    print(".")
//    cardIt.frameEffects.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardFrameEffects::class, cardIt.uuid, subIt)) } // Probably don't need
//    print(".")
//    cardIt.keywords.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardKeywords::class, cardIt.uuid, subIt)) } //Probably don't need
//    print(".")
//    cardIt.otherFaceIds.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardOtherFaceIds::class, cardIt.uuid, subIt)) }
//    print(".")
//    cardIt.promoTypes.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardPromoTypes::class, cardIt.uuid, subIt)) }//Probably don't need
//    print(".")
//    cardIt.subtypes.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardSubtypes::class, cardIt.uuid, subIt)) }
//    print(".")
//    cardIt.types.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardTypes::class, cardIt.uuid, subIt)) }
//    print(".")
//    cardIt.printings.items().forEach { subIt -> WriteOut.writeCardExtras(Because.actualCommandToRunNarrowData(CardPrintings::class, cardIt.uuid, subIt)) }//Probably don't need
//    print(".")

//Wide Data Tables
//    if (cardIt.purchaseUrls.isEmpty().not()){
//        WriteOut.writeCardExtras(Because.actualCommandToRunWideData(cardIt.uuid, cardIt.purchaseUrls))//Probably don't need
//        print(".")
//    }