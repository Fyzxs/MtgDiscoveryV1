package organize.printings

import organize.*
import organize.printings.wide.Identifiers
import java.util.*

interface CardToken{
    val artist: String
    val asciiName: String
    val availability: CardAvailabilities
    val borderColor: String
    val colorIdentity: CardColorIdentities
    val colorIndicator: CardColorIndicators
    val colors: CardColors
    val faceName: String
    val flavorText: String
    val frameEffects: CardFrameEffects
    val frameVersion: String
    val hasFoil: Boolean
    val hasNonFoil: Boolean
    val identifiers: Identifiers
    val isFullArt: Boolean
    val isOnlineOnly: Boolean
    val isPromo: Boolean
    val isReprint: Boolean
    val keywords: CardKeywords
    val layout: String
    val loyalty: String
    val name: String
    val number: String
    val power: String
    val promoTypes: CardPromoTypes
    val reverseRelated: ReverseRelatedCards
    val setCode: String
    val side: String
    val subtypes: CardSubtypes
    val supertypes: CardSupertypes
    val text: String
    val toughness: String
    val type: String
    val types: CardTypes
    val uuid: UUID
    val watermark: String
    val parentCode : String
    val rarity : String
}