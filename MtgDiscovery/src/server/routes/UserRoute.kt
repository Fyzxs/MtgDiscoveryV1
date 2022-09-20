package server.routes

import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import ktor.auth.UserNotFound
import ktor.model.users.*
import ktor.repository.UserRepository
import ktor.service.AuthService
import ktor.util.user

fun Route.user(userRepository: UserRepository) {
    val authService = AuthService(userRepository)

    @Serializable
    data class RegistrationFailure(val message: String)
    @Serializable
    data class RegistrationFailureWrapper(val inner: RegistrationFailure)


    route("users") {
        post("login") {
            val contents = call.receiveText()
            val decodeFromString = Json.decodeFromString<CredentialWrapper>(contents)
            val details = decodeFromString.user
            val user = authService.login(details)
            val message = Json.encodeToString(AuthNUserWrapper(user))

            call.respond(message)
        }

        post("register"){
            try {
                val contents = call.receiveText()
                val decodeFromString = Json.decodeFromString<RegistrationWrapper>(contents)
                val details = decodeFromString.user
                val user = authService.register(details)
                val message = Json.encodeToString(AuthNUserWrapper(user))
                call.respond(message)
            }catch(cause:Throwable){
                call.respond(HttpStatusCode.InternalServerError, Json.encodeToString(RegistrationFailureWrapper(RegistrationFailure(cause.message!!))))
            }
        }
    }

    authenticate {
        route("user") {
            get {
                val (uuid, displayName, token) = call.user!!
                val user = userRepository.findUser(displayName) ?: throw UserNotFound
                val message = Json.encodeToString(AuthNUserWrapper(call.user!!))
                call.respond(message)
            }

            /*put {
                val current = call.user!!
                val new = call.receive<UserWrapper>().user
                val updated = authService.updateUser(new, current)
                call.respond(UserWrapper(updated))
            }*/
        }
    }
}