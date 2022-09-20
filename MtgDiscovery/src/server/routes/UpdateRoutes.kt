package server.routes

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.util.pipeline.*
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import ktor.model.UserCardDto
import ktor.model.UserCardsWrapper
import ktor.tables.users.UserCards
import ktor.util.user
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

fun Route.updates() {

    authenticate {
        put("user/collection/massupdate") {
            try {
                val contents = call.receiveText()
                val decodeFromString = Json.decodeFromString<List<UserCardDto>>(contents)
                if (decodeFromString.none()) {
                    call.respond(HttpStatusCode.NotAcceptable)
                    return@put
                }
                val userId = decodeFromString.first().userUuid
                if (call.user?.uuid != userId) {
                    call.respond(HttpStatusCode.Unauthorized)
                    return@put
                }
                val queryList = decodeFromString.map {
                    "EXECUTE [dbo].[UpsertUserCard]" +
                            " '${it.userUuid}'" +
                            ", '${it.cardUuid}'" +
                            ", '${it.isForcedFoilSet}'" +
                            ", '${it.isForcedExtendedSet}'" +
                            ", '${it.isFoilOnly}'" +
                            ", '${it.setCode}'" +
                            ", '${it.setType}'" +
                            ", ${it.count}"
                }

                transaction {
                    val conn = TransactionManager.current().connection
                    conn.executeInBatch(queryList)
                }
                call.respondText("{\"success\":true}", status = HttpStatusCode.Accepted)
            } catch (cause: Throwable) {
                val msg = cause.message
                call.respondText(cause.message!!, status = HttpStatusCode.InternalServerError)
            }
        }
    }

}