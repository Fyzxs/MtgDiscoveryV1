package server

import io.ktor.routing.*
import ktor.repository.CardsRepository
import ktor.repository.UserRepository
import server.routes.updates
import server.routes.user

fun Routing.setupV1Apis(
    userRepository: UserRepository
) {
    route("/api/v1") {
        user(userRepository)
        updates()
    }
}