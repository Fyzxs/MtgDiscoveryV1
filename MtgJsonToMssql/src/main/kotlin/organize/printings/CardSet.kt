package organize.printings

import java.time.LocalDate

interface CardSet {
    val baseSetSize: Int
    val block: String
    val cards: Sequence<Card>
    val code: String
    val codeV3: String
    val isForeignOnly: Boolean
    val isFoilOnly: Boolean
    val isNonFoilOnly: Boolean
    val isOnlineOnly: Boolean
    val isPaperOnly: Boolean
    val isPartialPreview: Boolean
    val mcmName: String
    val mcmId: Int
    val mtgoCode: String
    val keyruneCode: String
    val name: String
    val parentCode: String
    val releaseDate: LocalDate
    val tokens: Sequence<Card>
    val totalSetSize: Int
    //val translations: Translations
    val type: String
    val actualname: String
    val actualType: String
    val actualCode: String
    val isForcedExtendedSet:Boolean
    val isForcedTokenSet:Boolean
    val isForcedFoilSet:Boolean
    val srcBaseSetSize: Int
    val calculatedSetSize: Int
    fun isSetExtendable(): Boolean
    fun shouldNotProcessSet(): Boolean
}