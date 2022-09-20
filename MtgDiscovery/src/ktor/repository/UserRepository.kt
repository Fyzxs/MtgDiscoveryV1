package ktor.repository

import ktor.model.users.PasswordUser
import ktor.model.users.HashedRegistrationDetails
import ktor.model.users.PublicUser

interface UserRepository {

    fun findUser(email: String): PasswordUser?

    fun insertUser(details: HashedRegistrationDetails): Int
    fun getPublicUserDataByUserId(uuid: String): PublicUser?
    fun getPublicUserDataByDisplayName(displayName: String): PublicUser?

    //fun updateUser(new: User, current: User): User?
}