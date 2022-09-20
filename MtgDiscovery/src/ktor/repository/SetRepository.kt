package ktor.repository

import ktor.model.CardSetDto

interface SetRepository {
    fun getAllSets(): List<CardSetDto>
    fun getAllSetsWithUserCount(userId: String): List<CardSetDto>
    fun getParentAndChildSets(set: String): List<CardSetDto>
    fun getParentAndChildSetsWithUserCount(set: String, userId: String): List<CardSetDto>
    fun getSet(set : String): List<CardSetDto>
    fun getSetWithUserCount(set : String, userId: String): List<CardSetDto>
    fun getExcluded(): List<CardSetDto>
}

