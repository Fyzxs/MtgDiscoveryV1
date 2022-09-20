package server

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.response.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import ktor.auth.AuthenticationException
import ktor.auth.AuthorizationException
import serverLogger

fun StatusPages.Configuration.setup() {
    exception<Throwable> { internal ->
        val status = when (internal) {
            is AuthenticationException -> internal.status
            is AuthorizationException -> internal.status
            else -> HttpStatusCode.InternalServerError
        }

        when {
            status.value.toString().startsWith("5") -> {
                serverLogger.error(internal.message, internal)
                call.respond(status, Json.encodeToString(InternalServerError))
            }
            else -> {
                serverLogger.warn(internal.message)
                call.respond(status, Json.encodeToString(internal))
            }
        }
    }
}

val InternalServerError =
    StatusException("Sorry, we encountered an error and are working on it.", HttpStatusCode.InternalServerError)

open class StatusException(
    message: String?,
    open val status: HttpStatusCode = HttpStatusCode.InternalServerError,
    cause: Throwable? = null
) : Exception(message, cause)
