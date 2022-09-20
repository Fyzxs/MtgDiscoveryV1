package ktor.repository

import ktor.model.CardDto

interface CardsRepository{
    fun getCardsInSet(set: String): List<CardDto>
    fun getCardsInParentAndChildSets(set: String): List<CardDto>
    fun getCardsInParentAndChildSetsWithUserCount(set: String, userId: String): List<CardDto>
    fun getCardsInSetWithUserCount(set: String, userId: String): List<CardDto>
    fun getParentSetAnnoyingCards(set: String): List<CardDto>
    fun getParentSetAnnoyingCardsWithUserCount(set: String, userId: String): List<CardDto>
    fun getExcluded(): List<CardDto>
    fun getArtistCards(artistName : String): List<CardDto>
    fun getCardNameCards(cardName : String): List<CardDto>
    fun getCardNameCardsWithUserCount(cardName : String, userId : String): List<CardDto>
    fun getArtistCardsWithUserCount(artistName : String, userId : String): List<CardDto>
    fun getCardNameSearchStartsWith(cardName: String): List<CardDto>
    fun getCardNameSearchStartsWithWithUserCount(cardName: String, userId: String): List<CardDto>
}