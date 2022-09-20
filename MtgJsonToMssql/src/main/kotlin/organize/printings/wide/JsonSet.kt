package organize.printings.wide

import kotlinx.serialization.json.JsonElement
import organize.*
import organize.printings.*
import java.time.LocalDate

data class JsonCardSet(val jsonElement: JsonElement) : CardSet {

    override val block: String = jsonElement.stringOpt("block")
    override val cards: Sequence<Card> = SetCards(jsonElement, this)
    override val code: String = jsonElement.string("code")
    override val baseSetSize: Int = adjustedBaseSetSize()//jsonElement.intOpt("baseSetSize")
    override val codeV3: String = jsonElement.stringOpt("codeV3")
    override val isForeignOnly: Boolean = jsonElement.booleanOpt("isForeignOnly")
    override val isFoilOnly: Boolean = jsonElement.boolean("isFoilOnly")
    override val isNonFoilOnly: Boolean = jsonElement.booleanOpt("isNonFoilOnly")
    override val isOnlineOnly: Boolean = jsonElement.boolean("isOnlineOnly")
    override val isPaperOnly: Boolean = jsonElement.booleanOpt("isPaperOnly")
    override val isPartialPreview: Boolean = jsonElement.booleanOpt("isPartialPreview")
    override val mcmName: String = jsonElement.stringOpt("mcmName")
    override val mcmId: Int = jsonElement.intOpt("mcmId")
    override val mtgoCode: String = jsonElement.stringOpt("mtgoCode")
    override val keyruneCode: String = jsonElement.string("keyruneCode")
    override val name: String = jsonElement.string("name")
    override val actualname: String = jsonElement.string("name")
    override val parentCode: String = jsonElement.stringOpt("parentCode")
    override val releaseDate: LocalDate = jsonElement.date("releaseDate")
    override val tokens: Sequence<Card> = SetTokens(jsonElement, this)
    override val totalSetSize: Int = jsonElement.int("totalSetSize")
    override val type: String = jsonElement.string("type")

    //Custom Fields
    override val isForcedExtendedSet: Boolean = false
    override val isForcedTokenSet: Boolean = false
    override val isForcedFoilSet: Boolean = false
    override val srcBaseSetSize: Int = baseSetSize
    override val calculatedSetSize: Int = -1 //Should not use this one

    override val actualType: String = type
    override val actualCode: String = jsonElement.string("code")
    override fun isSetExtendable(): Boolean {
        return (type.startsWith("core") || //duh
                type.startsWith("expansion") || //duh
                type.startsWith("masters") || //eg - TimeSpiral
                type.startsWith("draft_innovation")// Commander
                )

                //promos are not extendable
                && type.startsWith("promo").not()
        //Expand as more are discovered
    }

    override fun shouldNotProcessSet(): Boolean {
        return isForeignOnly || isOnlineOnly
    }

    private fun adjustedBaseSetSize() : Int{
        return when(code){
            "M21" -> 274
            "ZNR" -> 280
            "KHM" -> 285
            "TSR" -> 289
            "C21" -> 327
            "STA" -> 63
            else -> jsonElement.intOpt("baseSetSize")
        }
    }
}

private const val TenthEditionFoilVariant = "★"
fun Card.primaryCardFace() = side == "" || side == "a"
fun Card.isNotExtendedCard(set: CardSet) = this.numericNumber() <= set.srcBaseSetSize

data class NullObjectSet(val srcSet: CardSet) : CardSet by srcSet {
    override fun shouldNotProcessSet() = true
    override val cards: Sequence<Card> = emptySequence()
    override val tokens: Sequence<Card> = emptySequence()
}

data class RegularSet(val srcSet: CardSet) : CardSet by srcSet {
    override val cards: Sequence<Card> = filtered()//Only create cards that are both

    //Custom Fields
    override fun shouldNotProcessSet() = cards.none()
    override val calculatedSetSize: Int = cards.count()

    private fun filtered(): Sequence<RegularSetCard> {
        return srcSet.cards.filter {
            val primaryFaceCard = it.primaryCardFace()
            val notExtended = it.isNotExtendedCard(this)
            val notExtendableSet = this.isSetExtendable().not()
            val noPromoTypes = it.promoTypes.none()// { typeIt -> typeIt == "boosterfun"}
            val includeBasedOnExtendability = (notExtended || notExtendableSet) && (noPromoTypes || notExtendableSet)
            val doesNotEndWithFoilIndicator = excludeTenthFoil(this, it)
            val notAnExcludedCard = notAnExcludedCard(it)

            primaryFaceCard && includeBasedOnExtendability && notAnExcludedCard && doesNotEndWithFoilIndicator
        }.map { RegularSetCard(it, this) }
    }

}

data class FoilRegularSet(val srcSet: CardSet) : CardSet by srcSet {
    override val cards: Sequence<Card> = filtered()

    override val parentCode: String = if (srcSet.parentCode.isBlank()) srcSet.code else srcSet.parentCode
    override val tokens: Sequence<Card> = emptySequence()
    override val code: String = srcSet.code + "-F"
    override val name: String = srcSet.name + " - Foil"
    override val type: String = srcSet.type + "-foil"
    override val isForcedFoilSet: Boolean = true
    override val calculatedSetSize: Int = cards.count()
    override fun shouldNotProcessSet() = cards.none() || allCardsIncludedInNonFoilSet()

    private fun allCardsIncludedInNonFoilSet():Boolean{
        return cards.all { existsInNonFoil(it) }
    }
    private fun existsInNonFoil(it: Card): Boolean {
        return (it.hasFoil && !it.hasNonFoil) || (!it.hasFoil && it.hasNonFoil)
    }

    private fun filtered(): Sequence<FoilRegularSetCard> {
        return srcSet.cards.filter {
            val primaryFaceCard = it.primaryCardFace()
            val hasFoil = it.hasFoil
            val notExtended = it.isNotExtendedCard(this)
            val notExtendableSet = this.isSetExtendable().not()
            val noPromoTypes = it.promoTypes.none()// { typeIt -> typeIt == "boosterfun"}
            val includeBasedOnExtendability = (notExtended || notExtendableSet) && (noPromoTypes || notExtendableSet)
            val notAnExcludedCard = notAnExcludedCard(it)

            primaryFaceCard && hasFoil && includeBasedOnExtendability && notAnExcludedCard
        }.map { FoilRegularSetCard(it, this) }
    }
}

data class ExtendedSet(val srcSet: CardSet) : CardSet by srcSet {
    override val parentCode: String = if (srcSet.parentCode.isBlank()) srcSet.code else srcSet.parentCode
    override val tokens: Sequence<Card> = emptySequence()
    override val code: String = srcSet.code + "-E"
    override val name: String = srcSet.name + " - Extended"
    override val type: String = srcSet.type + "-extended"
    override val isForcedExtendedSet: Boolean = true
    override val cards: Sequence<Card> = filtered()
    override val calculatedSetSize: Int = cards.count()
    override fun shouldNotProcessSet() = cards.none()

    private fun filtered(): Sequence<Card> {
        return srcSet.cards.filter {
            val primaryFaceCard = it.primaryCardFace()
            val isExtended = it.isNotExtendedCard(this).not()
            val isExtendableSet = this.isSetExtendable()
            val hasPromoTypes = it.promoTypes.any()// { typeIt -> typeIt == "boosterfun"}
            val includeBasedOnExtendability = (isExtended && isExtendableSet) || (hasPromoTypes && isExtendableSet)
            val notAnExcludedCard = notAnExcludedCard(it)

            primaryFaceCard && includeBasedOnExtendability && notAnExcludedCard
        }.map { ExtendedSetCard(it, this) }
    }
}

data class FoilExtendedSet(val srcSet: CardSet) : CardSet by srcSet {
    override val parentCode: String = if (srcSet.parentCode.isBlank()) srcSet.code else srcSet.parentCode
    override val tokens: Sequence<Card> = emptySequence()
    override val code: String = srcSet.code + "-E-F"
    override val name: String = srcSet.name + " - Extended - Foil"
    override val type: String = srcSet.type + "-extended-foil"
    override val isForcedExtendedSet: Boolean = true
    override val isForcedFoilSet: Boolean = true
    override val cards: Sequence<Card> = filtered()
    override val calculatedSetSize: Int = cards.count()
    override fun shouldNotProcessSet() = cards.none() || allCardsIncludedInNonFoilSet()

    private fun filtered(): Sequence<Card> {
        return srcSet.cards.filter {
            val primaryFaceCard = it.primaryCardFace()
            val isExtended = it.isNotExtendedCard(this).not()
            val isExtendableSet = this.isSetExtendable()
            val hasPromoTypes = it.promoTypes.any()// { typeIt -> typeIt == "boosterfun"}
            val includeBasedOnExtendability = (isExtended && isExtendableSet) ||  (hasPromoTypes && isExtendableSet)
            val hasFoil = it.hasFoil
            val notAnExcludedCard = notAnExcludedCard(it)

            primaryFaceCard && includeBasedOnExtendability && hasFoil && notAnExcludedCard
        }.map { FoilExtendedSetCard(it, this) }
    }

    private fun allCardsIncludedInNonFoilSet():Boolean{
        return cards.all { existsInNonFoilExtended(it) }
    }
    private fun existsInNonFoilExtended(it: Card): Boolean {
        return (it.hasFoil && !it.hasNonFoil) || (!it.hasFoil && it.hasNonFoil)
    }
}

data class TokenSet(val srcSet: CardSet) : CardSet by srcSet {
    override val parentCode: String = if (srcSet.parentCode.isBlank()) srcSet.code else srcSet.parentCode
    override val cards: Sequence<Card> = filtered()
    override val tokens: Sequence<Card> = emptySequence()
    override val code: String = if(shouldNotProcessSet()) "TokenSet-${srcSet.code}" else ((if (cards.first().setCode == srcSet.code) srcSet.code + "-T" else cards.first().setCode))
    override val name: String = srcSet.actualname + (if(srcSet.actualname.contains("Tokens").not()) " - Tokens" else "")
    override val type: String = srcSet.type + "-token"
    override val actualType: String = "token"
    override val isForcedTokenSet: Boolean = true
    override val calculatedSetSize: Int = cards.count()
    override fun shouldNotProcessSet() = cards.none()

    private fun filtered(): Sequence<Card> {
        return srcSet.tokens.filter {
            val notAnExcludedCard = notAnExcludedCard(it)
            notAnExcludedCard
        }.map { TokenSetCard(it, this) }
    }
}

data class FoilTokenSet(val srcSet: CardSet) : CardSet by srcSet {
    override val parentCode: String = if (srcSet.parentCode.isBlank()) srcSet.code else srcSet.parentCode
    override val cards: Sequence<Card> = filtered()
    override val tokens: Sequence<Card> = emptySequence()
    override val code: String = if(shouldNotProcessSet()) "FoilTokenSet-${srcSet.code}" else ((if (cards.first().setCode == srcSet.code) srcSet.code + "-T" else cards.first().setCode) + "-F")
    override val name: String = "${srcSet.actualname} - Tokens - Foil"
    override val type: String = srcSet.type + "-token-foil"
    override val actualType: String = "token"
    override val isForcedTokenSet: Boolean = true
    override val isForcedFoilSet: Boolean = true
    override val calculatedSetSize: Int = cards.count()
    override fun shouldNotProcessSet() = cards.none() || allCardsIncludedInNonFoilSet()

    private fun filtered(): Sequence<Card> {
        val filtered = srcSet.tokens.filter {
            val hasFoil = it.hasFoil
            val notAnExcludedCard = notAnExcludedCard(it)

            hasFoil && notAnExcludedCard
        }.map { FoilTokenSetCard(it, this) }

        return if (filtered.all { existsInNonFoilToken(it) }) emptySequence() else filtered
    }

    private fun allCardsIncludedInNonFoilSet():Boolean{
        return cards.all { existsInNonFoilToken(it) }
    }

    private fun existsInNonFoilToken(it: Card): Boolean {
        return (it.hasFoil && !it.hasNonFoil) || (!it.hasFoil && it.hasNonFoil)
    }
}

data class ExcludedSet(val srcSet: CardSet) : CardSet by srcSet{
    override val cards: Sequence<Card> = filtered()
    override val tokens: Sequence<Card> = emptySequence()

    private fun filtered(): Sequence<Card> {
        return srcSet.cards.filter {
            anExcludedCard(it)
        }.map { RegularSetCard(it, this) }
    }
}

fun excludeTenthFoil(setIt: CardSet, cardIt: Card) = (cardIt.number.endsWith(TenthEditionFoilVariant) && "10E" == setIt.code).not()
fun notAnExcludedCard(card: Card) = shouldNotProcessCardAtAll(card).not()
fun anExcludedCard(card: Card) = shouldNotProcessCardAtAll(card)
fun shouldNotProcessCardAtAll(cardIt: Card): Boolean {
    return shouldNotProcessSpecificNumberSuffix(cardIt) || shouldNotProcessAsForeignPrint(cardIt)
}

fun shouldNotProcessAsForeignPrint(cardIt: Card): Boolean {
    return cardIt.setType != "promo" && cardIt.number.endsWith("s")
}

fun shouldNotProcessSpecificNumberSuffix(cardIt: Card): Boolean {
    val isTenthEditionExclusion = cardIt.setCode == "10E" && cardIt.number.endsWith(TenthEditionFoilVariant)

    return cardIt.setType != "promo" && excludedNumberSuffixCharacters.any { cardIt.number.endsWith(it) } && isTenthEditionExclusion.not()
}
