package organize

import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.jsonPrimitive
import organize.printings.*
import organize.printings.wide.CardForeignDatum
import organize.printings.wide.JsonCardSet

interface MySequences<T> : Sequence<T>{
    fun items() : Sequence<T>
}


abstract class ArraySequence<T>(private val jsonElement: JsonElement, private val key : String, private val transform: (JsonElement) -> T) : MySequences<T>{
    override fun items(): Sequence<T> {
        return jsonElement.arraySequence(key, transform)
    }

    override fun iterator(): Iterator<T> {
        return items().iterator()
    }
}

abstract class ObjectSequence<T>(private val jsonElement: JsonElement, private val key : String, private val transform: (Map.Entry<String, JsonElement>) -> T): MySequences<T>{
    override fun items(): Sequence<T> {
        return jsonElement.objectSequence(key, transform)
    }
    override fun iterator(): Iterator<T> {
        return items().iterator()
    }
}

abstract class StringSequence(jsonElement: JsonElement, key : String) : ArraySequence<String>(jsonElement, key, { it.jsonPrimitive.content})
abstract class SafeStringSequence(jsonElement: JsonElement, key : String) :StringSequence(jsonElement, key){
    override fun items(): Sequence<String> {
        return try{
            super.items()
        } catch(ignored: Throwable){
            emptySequence()
        }
    }
}

class AllPrintings(jsonElement: JsonElement) : ObjectSequence<CardSet>(jsonElement, "data", { JsonCardSet(it.value) })
class SetCards(jsonElement: JsonElement, setRef: CardSet): ArraySequence<Card>(jsonElement, "cards", { JsonCard(it, setRef) })
class SetTokens(jsonElement: JsonElement, setRef: CardSet): ArraySequence<Card>(jsonElement, "tokens", { JsonCard(it, setRef) })
class CardForeignData(jsonElement: JsonElement): ArraySequence<CardForeignDatum>(jsonElement, "foreignData", { CardForeignDatum(it) })
class CardVariations(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "variations")
class CardOtherFaceIds(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "otherFaceIds")
class CardTypes(jsonElement: JsonElement) : StringSequence(jsonElement, "types")
class CardSupertypes(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "supertypes")
class CardSubtypes(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "subtypes")
class CardPrintings(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "printings")
class ReverseRelatedCards(jsonElement: JsonElement) : StringSequence(jsonElement, "reverseRelated")
class CardKeywords(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "keywords")
class CardAvailabilities(jsonElement: JsonElement) : StringSequence(jsonElement, "availability")
class CardPromoTypes(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "promoTypes")
class CardColorIdentities(jsonElement: JsonElement) : StringSequence(jsonElement, "colorIdentity")
class CardColorIndicators(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "colorIndicator")
class CardColors(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "colorIndicator")
class CardFrameEffects(jsonElement: JsonElement) : SafeStringSequence(jsonElement, "frameEffects")
class Translations(jsonElement: JsonElement, private val english: String)
    : ObjectSequence<Translation>(jsonElement, "translations", {
                                                                        try {
                                                                            Translation(
                                                                                it.key,
                                                                                it.value.toString()
                                                                            )
                                                                        } catch (ignored: Exception) {
                                                                            Translation(
                                                                                it.key,
                                                                                "<<$english>>"
                                                                            )
                                                                        }
                                                                    })