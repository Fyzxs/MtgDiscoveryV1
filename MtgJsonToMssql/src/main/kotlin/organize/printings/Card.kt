package organize.printings

import organize.*
import organize.printings.wide.CardPurchaseUrls
import organize.printings.wide.Identifiers
import java.util.*

interface Card {
    val artist: String
    val asciiName: String
    val availability: CardAvailabilities
    val borderColor: String
    val colorIdentity: CardColorIdentities
    val colorIndicator: CardColorIndicators
    val colors: CardColors
    val convertedManaCost: Float
    val duelDeck: String
    val faceConvertedManaCost: Float
    val faceName: String
    val flavorText: String
    val frameEffects: CardFrameEffects
    val frameVersion: String
    val hand: String
    val hasContentWarning: Boolean
    val hasFoil: Boolean
    val hasAlternativeDeckLimit: Boolean
    val hasNonFoil: Boolean
    val identifiers: Identifiers
    val isAlternative: Boolean
    val isFullArt: Boolean
    val isOnlineOnly: Boolean
    val isOversized: Boolean
    val isPromo: Boolean
    val isReprint: Boolean
    val isReserved: Boolean
    val isStarter: Boolean
    val isStorySpotlight: Boolean
    val isTextless: Boolean
    val isTimeshifted: Boolean
    val keywords: CardKeywords
    val layout: String
    val life: String
    val loyalty: String
    val manaCost: String
    val name: String
    val number: String
    val originalText: String
    val originalType: String
    val otherFaceIds: CardOtherFaceIds
    val power: String
    val printings: CardPrintings
    val promoTypes: CardPromoTypes
    val purchaseUrls: CardPurchaseUrls
    val rarity: String
    val setCode: String
    val side: String
    val subtypes: CardSubtypes
    val supertypes: CardSupertypes
    val text: String
    val toughness: String
    val type: String
    val types: CardTypes
    val uuid: UUID
    val variations: CardVariations
    val watermark: String

    // \/ CUSTOM THINGS \/
    val keyruneCode : String
    val isExtendedSetCard: Boolean
    val hasOtherFaceIds: Boolean
    val isForcedFoilSet: Boolean
    val setRef : CardSet
    val setType : String
    fun numericNumber(): Int
}