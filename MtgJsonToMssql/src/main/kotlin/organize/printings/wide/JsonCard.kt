package organize

import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.jsonObject
import organize.printings.*
import organize.printings.wide.CardPurchaseUrls
import organize.printings.wide.Identifiers
import java.util.*

data class JsonCard(private val jsonElement: JsonElement, override val setRef : CardSet) : Card {
    override val artist: String = jsonElement.stringOpt("artist", "Unspecified")
    override val asciiName: String = jsonElement.stringOpt("asciiName", "Unspecified")
    override val availability: CardAvailabilities = CardAvailabilities(jsonElement)
    override val borderColor: String = jsonElement.string("borderColor")
    override val colorIdentity: CardColorIdentities = CardColorIdentities(jsonElement)
    override val colorIndicator: CardColorIndicators = CardColorIndicators(jsonElement)
    override val colors: CardColors = CardColors(jsonElement)
    override val convertedManaCost : Float = jsonElement.floatOpt("convertedManaCost")
    override val duelDeck : String = jsonElement.stringOpt("duelDeck")
    override val faceConvertedManaCost : Float = jsonElement.floatOpt("faceConvertedManaCost")
    override val faceName: String = jsonElement.stringOpt("faceName")
    override val flavorText: String = jsonElement.stringOpt("flavorText")
    override val frameEffects: CardFrameEffects = CardFrameEffects(jsonElement)
    override val frameVersion: String = jsonElement.string("frameVersion")
    override val hand: String = jsonElement.stringOpt("hand")
    override val hasContentWarning : Boolean = jsonElement.booleanOpt("hasContentWarning")
    override val hasAlternativeDeckLimit : Boolean = jsonElement.booleanOpt("hasAlternativeDeckLimit")
    override val hasFoil: Boolean = jsonElement.boolean("hasFoil")
    override val hasNonFoil: Boolean = jsonElement.boolean("hasNonFoil")
    override val identifiers: Identifiers = Identifiers(jsonElement.jsonObject["identifiers"]!!)
    override val isAlternative: Boolean = jsonElement.booleanOpt("isAlternative")
    override val isFullArt: Boolean = jsonElement.booleanOpt("isFullArt")
    override val isOnlineOnly: Boolean = jsonElement.booleanOpt("isOnlineOnly")
    override val isOversized: Boolean = jsonElement.booleanOpt("isOversized")
    override val isPromo: Boolean = jsonElement.booleanOpt("isPromo")
    override val isReprint: Boolean = jsonElement.booleanOpt("isReprint")
    override val isReserved: Boolean = jsonElement.booleanOpt("isReserved")
    override val isStarter: Boolean = jsonElement.booleanOpt("isStarter")
    override val isStorySpotlight: Boolean = jsonElement.booleanOpt("isStorySpotlight")
    override val isTextless: Boolean = jsonElement.booleanOpt("isTextless")
    override val isTimeshifted: Boolean = jsonElement.booleanOpt("isTimeshifted")
    override val keywords: CardKeywords = CardKeywords(jsonElement)
    override val layout: String = jsonElement.string("layout")
    override val life: String = jsonElement.stringOpt("life")
    override val loyalty: String = jsonElement.stringOpt("loyalty")
    override val manaCost: String = jsonElement.stringOpt("manaCost")
    override val name: String = jsonElement.string("name")
    override val number: String = jsonElement.string("number")
    override val originalText: String = jsonElement.stringOpt("originalText")
    override val originalType: String = jsonElement.stringOpt("originalType")
    override val otherFaceIds: CardOtherFaceIds = CardOtherFaceIds(jsonElement)
    override val power: String = jsonElement.stringOpt("Power")
    override val printings: CardPrintings = CardPrintings(jsonElement)
    override val promoTypes: CardPromoTypes = CardPromoTypes(jsonElement)
    override val purchaseUrls : CardPurchaseUrls = CardPurchaseUrls(jsonElement.jsonObject["purchaseUrls"])
    override val rarity : String = jsonElement.stringOpt("rarity")
    override val setCode: String = jsonElement.string("setCode")// + if(setRef.isForcedFoilSet) "-F" else ""
    override val side: String = jsonElement.stringOpt("side")
    override val subtypes: CardSubtypes = CardSubtypes(jsonElement)
    override val supertypes: CardSupertypes = CardSupertypes(jsonElement)
    override val text: String = jsonElement.stringOpt("text")
    override val toughness: String = jsonElement.stringOpt("toughness")
    override val type: String = jsonElement.string("type")
    override val types: CardTypes = CardTypes(jsonElement)
    override val uuid: UUID = jsonElement.uuid("uuid")
    override val variations: CardVariations = CardVariations(jsonElement)
    override val watermark: String = jsonElement.stringOpt("watermark")

    //Custom Stuff
    override val hasOtherFaceIds: Boolean = otherFaceIds.items().any()
    override val isExtendedSetCard: Boolean = false
    override val isForcedFoilSet: Boolean = false
    override val setType: String = setRef.actualType
    override val keyruneCode: String = setRef.keyruneCode
    override fun numericNumber() : Int = number.filter { it.isDigit() }.toInt()
}

data class RegularSetCard(val srcCard : Card, override val setRef : CardSet): Card by srcCard {
    override val isExtendedSetCard = false
    override val setType: String = setRef.actualType
}
data class ExtendedSetCard(val srcCard : Card, override val setRef : CardSet): Card by srcCard {
    override val isExtendedSetCard = true
    override val keyruneCode: String = setRef.keyruneCode
    override val setType: String = setRef.actualType
}
data class TokenSetCard(val srcCard : Card, override val setRef : CardSet): Card by srcCard {
    override val setCode: String = tokenSetCode(srcCard)
    override val rarity : String = tokenRarity()
    override val keyruneCode: String = setRef.keyruneCode
    override val setType: String = setRef.actualType
}

data class FoilRegularSetCard(val srcCard : Card, override val setRef : CardSet): Card by srcCard {
    override val isForcedFoilSet: Boolean = isForcedFoil(srcCard)
    override val keyruneCode: String = setRef.keyruneCode
    override val setType: String = setRef.actualType
}
data class FoilExtendedSetCard(val srcCard : Card, override val setRef : CardSet): Card by srcCard {
    override val isForcedFoilSet: Boolean = isForcedFoil(srcCard)
    override val isExtendedSetCard = true
    override val keyruneCode: String = setRef.keyruneCode
    override val setType: String = setRef.actualType
}
data class FoilTokenSetCard(val srcCard : Card, override val setRef : CardSet): Card by srcCard {
    override val isForcedFoilSet: Boolean = isForcedFoil(srcCard)
    override val setCode: String = tokenSetCode(srcCard)
    override val rarity : String = tokenRarity()
    override val keyruneCode: String = setRef.keyruneCode
    override val setType: String = setRef.actualType
}
fun tokenRarity() = "token"
fun tokenSetCode(srcCard : Card) = srcCard.setCode + (if (srcCard.setCode == srcCard.setRef.code) "-T" else "")
fun isForcedFoil(srcCard : Card) = if(!srcCard.hasFoil) throw Exception("Not a Foil Card!!!") else srcCard.hasNonFoil