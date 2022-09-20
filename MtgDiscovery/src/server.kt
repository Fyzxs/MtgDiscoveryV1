import config.ConfigManager
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.servlet.*
import io.ktor.util.pipeline.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import ktor.auth.JwtConfig
import ktor.model.users.AuthNUser
import ktor.repository.*
import ktor.util.unescapeHTML
import org.jetbrains.exposed.sql.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import server.setupV1Apis
import java.net.URL
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import java.util.*

val infiniteCache = mutableMapOf<String, String>()
fun infiniteCacheSetup(key: String, getValue: () -> String): String {
    if (infiniteCache.containsKey(key)) return infiniteCache[key]!!

    val value = getValue()
//    if (ConfigManager.isLocal) return value;
//
//    infiniteCache[key] = value
    return value
}


fun Application.module() {
    install(DefaultHeaders)

    install(StatusPages) {
        exception<Throwable> { cause ->
            when (cause.message) {
                "The specified user could not be found",
                "Wrong Password" -> {
                    val x: String = if (cause.message == null) "Invalid Credentials" else cause.message!!
                    call.respond(HttpStatusCode.Unauthorized, x)
                }
                else -> call.respond(HttpStatusCode.InternalServerError, "Internal Server Error::" + cause.message)
            }
        }
    }

    val userRepository: UserRepository = ExposedUserRepository()
    val setRepository: SetRepository = ExposedSetRepository()
    val cardsRepository: CardsRepository = ExposedCardsRepository()
    val collectionRepository: CollectionRepository = ExposedCollectionRepository()

    install(Authentication) {
        jwt {
            authSchemes("Bearer")
            verifier(JwtConfig.verifier)
            realm = JwtConfig.realm
            validate {
                val displayName = it.payload.getClaim("displayName")?.asString()?.unescapeHTML() ?: return@validate null
                userRepository.findUser(displayName)?.let { user ->
                    val token = JwtConfig.makeToken(user)
                    AuthNUser(uuid = user.uuid, token = token, displayName = user.displayName)
                }
            }
        }
    }

    install(Routing) {

        get("/health") {
            if(ConfigManager.isLocal) {
                URL("http://localhost:7071/api/health").readText()
            } else if(ConfigManager.isProd) {
                URL("<URL>>").readText()
            }
            call.respondText { "Beep-Boop" }
        }

        get("/api/v1/test") {

            try {
                call.respondText(Json.encodeToString(collectionRepository.getTotalCardCount()))
            } catch (cause: Throwable) {
                call.respondText(cause.message ?: "No Messages ${cause::javaClass}")
            }
        }

        get("/user/{userName}") {
            val userName = userName()
            val value = userRepository.getPublicUserDataByDisplayName(userName)
            if (value != null) {
                call.respondRedirect("/sets?ctor=${value.uuid}")
            } else {
                call.respondRedirect("/")
            }
        }

        get("/api/v1/user/{userId}") {
            val userId = call.parameters["userId"]!!
            val value = userRepository.getPublicUserDataByUserId(userId)
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        get("/api/v1/test/{userId}") {
            val userId = call.parameters["userId"]!!

            call.respondText(Json.encodeToString(collectionRepository.getUserCollectionSummary(userId)), ContentType.Application.Json)
        }


        get("/api/v1/set/excluded/cards") {
            val value = cardsRepository.getExcluded()
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        get("/api/v1/set/excluded") {
            val value = setRepository.getExcluded()
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        get("/api/v1/set/excluded/cards/{userId}") {
            val value = cardsRepository.getExcluded()
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        get("/api/v1/set/excluded/{userId}") {
            val value = setRepository.getExcluded()
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        /* Collection Routes */
        get("/api/v1/collection/summary") {
            val key = "summary"
            if (infiniteCache.containsKey(key).not()) {
                infiniteCache[key] = Json.encodeToString(TotalKnownCardsDtoWrapper(collectionRepository.getTotalCardCount()))
            }

            call.respondText(infiniteCache[key]!!, ContentType.Application.Json)
        }
        get("/api/v1/collection/summary/{userId}") {
            val userId = call.parameters["userId"]!!
            val value = collectionRepository.getUserCollectionSummary(userId)
            call.respondText(Json.encodeToString(UserCollectionSummaryDtoWrapper(value)), ContentType.Application.Json)
        }

        /* Set Routes */
        get("/api/v1/sets") {
            val text = infiniteCacheSetup("allSets") { Json.encodeToString(setRepository.getAllSets()) }
            call.respondText(text, ContentType.Application.Json)
        }

        get("/api/v1/sets/{userId}") {
            val userId = call.parameters["userId"]!!
            val value = setRepository.getAllSetsWithUserCount(userId)
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        get("/api/v1/set/{set}") {
            val set = call.parameters["set"]!!
            val text = infiniteCacheSetup("set-$set") { Json.encodeToString(setRepository.getSet(set)) }
            call.respondText(text, ContentType.Application.Json)
        }
        get("/api/v1/set/{set}/sets") {
            val set = call.parameters["set"]!!
            val text = infiniteCacheSetup("set-$set") { Json.encodeToString(setRepository.getParentAndChildSets(set)) }
            call.respondText(text, ContentType.Application.Json)
        }
        get("/api/v1/set/{set}/sets/{userId}") {
            val set = call.parameters["set"]!!
            val userId = call.parameters["userId"]!!

            val value = setRepository.getParentAndChildSetsWithUserCount(set, userId)
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }
        get("/api/v1/set/{set}/{userId}") {
            val set = call.parameters["set"]!!
            val userId = call.parameters["userId"]!!

            val value = setRepository.getSetWithUserCount(set, userId)
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        /* Card routes */
        get("/api/v1/search/card/name/{text}") {
            val text = call.parameters["text"]!!

            val response = Json.encodeToString(cardsRepository.getCardNameSearchStartsWith(text))
            call.respondText(response, ContentType.Application.Json)
        }
        get("/api/v1/search/card/name/{text}/{userId}") {
            val text = call.parameters["text"]!!
            val userId = call.parameters["userId"]!!

            val response = Json.encodeToString(cardsRepository.getCardNameSearchStartsWithWithUserCount(text, userId))
            call.respondText(response, ContentType.Application.Json)
        }
        get("/api/v1/artist/{artist}/cards") {
            val artist = call.parameters["artist"]!!

            val text = infiniteCacheSetup("cards-$artist") { Json.encodeToString(cardsRepository.getArtistCards(artist)) }

            call.respondText(text, ContentType.Application.Json)
        }
        get("/api/v1/artist/{artist}/cards/{userId}") {
            val artist = call.parameters["artist"]!!
            val userId = call.parameters["userId"]!!

            val text = Json.encodeToString(cardsRepository.getArtistCardsWithUserCount(artist, userId))
            call.respondText(text, ContentType.Application.Json)
        }
        get("/api/v1/card/{cardName}/cards") {
            val cardName = cardName()

            val text = infiniteCacheSetup("cards-$cardName") { Json.encodeToString(cardsRepository.getCardNameCards(cardName)) }
            call.respondText(text, ContentType.Application.Json)
        }
        get("/api/v1/card/{cardName}/cards/{userId}") {
            val cardName = cardName()
            val userId = call.parameters["userId"]!!

            val text = Json.encodeToString(cardsRepository.getCardNameCardsWithUserCount(cardName, userId))
            call.respondText(text, ContentType.Application.Json)
        }

        get("/api/v1/set/{set}/cards") {
            val set = call.parameters["set"]!!

            val text = infiniteCacheSetup("cards-$set") { Json.encodeToString(cardsRepository.getCardsInSet(set)) }
            call.respondText(text, ContentType.Application.Json)
        }

        get("/api/v1/set/{set}/cards/{userId}") {
            val set = call.parameters["set"]!!
            val userId = call.parameters["userId"]!!

            val value = cardsRepository.getCardsInSetWithUserCount(set, userId)
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }
        get("/api/v1/set/parent/{set}/cards") {
            val set = call.parameters["set"]!!
            val text = infiniteCacheSetup("cards-$set") { Json.encodeToString(cardsRepository.getCardsInParentAndChildSets(set)) }
            call.respondText(text, ContentType.Application.Json)
        }
        get("/api/v1/set/{set}/anoy") {
            val set = call.parameters["set"]!!

            val value = cardsRepository.getParentSetAnnoyingCards(set)
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        get("/api/v1/set/parent/{set}/cards/{userId}") {
            val set = call.parameters["set"]!!
            val userId = call.parameters["userId"]!!

            val value = cardsRepository.getCardsInParentAndChildSetsWithUserCount(set, userId)
            call.respondText(Json.encodeToString(value), ContentType.Application.Json)
        }

        /* User Routes */
        get("/api/v1/isAuthN") {
            try {
                val authHeader = call.request.headers["Authorization"]
                JwtConfig.verifier.verify(authHeader!!.replace("Bearer ", ""))
                call.respondText("{\"authenticated\":true}")
            } catch (cause: Throwable) {
                call.respondText("{\"authenticated\":false}")
            }
        }


        val staticPath = "/assets/pages/v2/"
        resources(staticPath)
        static {
            defaultResource("${staticPath}default.html")

            //Legals
            resource("terms", "${staticPath}terms.html")
            resource("privacy", "${staticPath}privacy.html")

            //Site stuff
            resource("about", "${staticPath}about.html")
            resource("howto", "${staticPath}howto.html")

            //User Stuff
            resource("register", "${staticPath}register.html")
            resource("login", "${staticPath}login.html")
            resource("profile", "${staticPath}profile.html")

            //card
            resource("setCardsBinder", "${staticPath}setCardsBinder.html")
            resource("setCards", "${staticPath}setCards.html")
            //resource("parentSet", "${staticPath}userCardParentSet.html")
            resource("artistCards", "${staticPath}artistCards.html")
            resource("cardVersions", "${staticPath}cardVersions.html")
            resource("cardSearch", "${staticPath}cardSearch.html")

            //sets
            resource("sets", "${staticPath}sets.html")

        }

        setupV1Apis(userRepository)
    }
}

private fun PipelineContext<Unit, ApplicationCall>.userName() = call.parameters["userName"]!!.stringClean()
private fun PipelineContext<Unit, ApplicationCall>.cardName() = call.parameters["cardName"]!!.stringClean()

private fun String.stringClean():String {
    return this.unescapeHTML()
}


val serverLogger: Logger = LoggerFactory.getLogger("Server")

class Setup {

    init {
        Database.connect(ConfigManager.dbConfig.url, user = ConfigManager.dbConfig.user, password = ConfigManager.dbConfig.password)
    }

}
