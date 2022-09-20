package com.example

import Setup
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*
import module

/*
fun main(args: Array<String>): Unit = io.ktor.server.tomcat.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    routing {
        get("/") {
            call.respondText("HELLO WORLD!", contentType = ContentType.Text.Plain)
        }
    }
}

*/
fun Application.main() {

    Setup()

    module()
}

