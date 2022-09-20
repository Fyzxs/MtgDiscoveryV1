package ktor.repository

import io.ktor.util.*
import ktor.model.*
import ktor.model.users.PasswordUser
import ktor.model.users.PublicUser
import ktor.tables.*
import ktor.tables.users.Users
import org.jetbrains.exposed.sql.ResultRow

fun ResultRow.toUser() = PasswordUser(
    uuid = this[Users.uuid].escapeHTML(),
    hash = this[Users.hash].escapeHTML(),
    displayName = this[Users.displayName].escapeHTML()
)

fun ResultRow.toPublicUser() = PublicUser(
    uuid = this[Users.uuid].escapeHTML(),
    displayName = this[Users.displayName].escapeHTML())

fun ResultRow.mapToCardExcludedDto(): CardDto {
    return CardDto(
        artist = this[CardsExcluded.artist].escapeHTML(),
        uuid = this[CardsExcluded.uuid].toString().escapeHTML(),
        name = this[CardsExcluded.name].escapeHTML(),
        rarity = this[CardsExcluded.rarity].escapeHTML(),
        setCode = this[CardsExcluded.setCode].escapeHTML(),
        keyRuneCode = this[CardsExcluded.keyRuneCode].escapeHTML(),
        number = this[CardsExcluded.number].escapeHTML(),
        hasFoil = this[CardsExcluded.hasFoil],//.escapeHTML(),
        hasNonFoil = this[CardsExcluded.hasNonFoil],//.escapeHTML(),
        faceName = this[CardsExcluded.faceName].escapeHTML(),
        isPromo = this[CardsExcluded.isPromo],//.escapeHTML(),
        side = this[CardsExcluded.side].escapeHTML(),
        isExtendedCardSet = this[CardsExcluded.isExtendedSetCard],//.escapeHTML(),
        isForcedFoilSet = this[CardsExcluded.isForcedFoilSet],//.escapeHTML(),
        layout = this[CardsExcluded.layout].escapeHTML(),
        setType = this[CardsExcluded.setType].escapeHTML(),
        //
        setName = this[CardSets.name].escapeHTML(),
        setReleaseDate = this[CardSets.releaseDate].toDate().toString().escapeHTML(),
        identifiers = IdentifiersDto("", "", "", ""),
        prices = CardPriceInfoDto(0.0, 0.0, 0.0, 0.0),
        countFoil = 0,
        countNonFoil = 0    
    )
}
fun ResultRow.mapToCardDto(): CardDto {
    return cardDto(Cards)
}

private fun ResultRow.cardDto(table: CardsTable): CardDto {
    return CardDto(
        artist = this[table.artist].escapeHTML(),
        uuid = this[table.uuid].toString().escapeHTML(),
        name = this[table.name].escapeHTML(),
        rarity = this[table.rarity].escapeHTML(),
        setCode = this[table.setCode].escapeHTML(),
        keyRuneCode = this[table.keyRuneCode].escapeHTML(),
        number = this[table.number].escapeHTML(),
        hasFoil = this[table.hasFoil],//.escapeHTML(),
        hasNonFoil = this[table.hasNonFoil],//.escapeHTML(),
        faceName = this[table.faceName].escapeHTML(),
        isPromo = this[table.isPromo],//.escapeHTML(),
        side = this[table.side].escapeHTML(),
        isExtendedCardSet = this[table.isExtendedSetCard],//.escapeHTML(),
        isForcedFoilSet = this[table.isForcedFoilSet],//.escapeHTML(),
        layout = this[table.layout].escapeHTML(),
        setType = this[table.setType].escapeHTML(),
        setName = this[CardSets.name].escapeHTML(),
        setReleaseDate = this[CardSets.releaseDate].toDate().toString().escapeHTML(),
        identifiers = this.mapToIdentifiersDto(),
        prices = this.mapToCardPriceInfoDto(),
        countFoil = 0,
        countNonFoil = 0
    )
}


fun ResultRow.mapToIdentifiersDto(): IdentifiersDto {
    return IdentifiersDto(
        scryfallId = this[Identifiers.scryfallId].escapeHTML() ,
        multiverseId = this[Identifiers.multiverseId].escapeHTML(),
        cardKingdomId = this[Identifiers.cardKingdomId].escapeHTML(),
        cardKingdomFoilId = this[Identifiers.cardKingdomFoilId].escapeHTML()
    )
}

fun ResultRow.mapToCardPriceInfoDto(): CardPriceInfoDto {
    return CardPriceInfoDto(
        averageFoil = this[CardPriceInfos.averageFoil]?.toDouble() ?: 0.0,
        averageRegular = this[CardPriceInfos.averageRegular]?.toDouble() ?: 0.0,
        latestFoil = this[CardPriceInfos.latestFoil]?.toDouble() ?: 0.0,
        latestRegular = this[CardPriceInfos.latestRegular]?.toDouble() ?: 0.0
    )
}

fun ResultRow.mapToCardSetExcludedDto(): CardSetDto {
    return cardSetDto(CardSetsExcluded)
}

fun ResultRow.mapToCardSetDto(): CardSetDto {
    return cardSetDto(CardSets)
}

private fun ResultRow.cardSetDto(table: CardSetsTable): CardSetDto {
    return CardSetDto(
        name = this[table.name].escapeHTML(),
        code = this[table.code].escapeHTML(),
        keyruneCode = this[table.keyruneCode].escapeHTML(),
        releaseDate = this[table.releaseDate].toDate().toString().escapeHTML(),
        parentCode = this[table.parentCode].escapeHTML(),
        actualCode = this[table.actualCode].escapeHTML(),
        type = this[table.type].escapeHTML(),
        actualType = this[table.actualType].escapeHTML(),
        baseSetSize = this[table.baseSetSize],//.escapeHTML(),
        calculatedSetSize = this[table.calculatedSetSize],//.escapeHTML(),
        block = this[table.block].escapeHTML(),
        totalSetSize = this[table.totalSetSize],//.escapeHTML(),
        isPartialPreview = this[table.isPartialPreview],//.escapeHTML(),
        ofSet = 0,
        collected = 0
    )
}