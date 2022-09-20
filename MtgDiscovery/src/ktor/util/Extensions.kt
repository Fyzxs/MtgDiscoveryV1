package ktor.util

import io.ktor.application.ApplicationCall
import io.ktor.auth.authentication
import io.ktor.util.*
import ktor.model.users.AuthNUser

val ApplicationCall.user: AuthNUser? get() = authentication.principal()

public fun String.unescapeHTML(): String {
    val text = this@unescapeHTML
    if (text.isEmpty()) return text
    return text
        .replace("&#x27;", "'")
        .replace("&quot;", "\"")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
}
