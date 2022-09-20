package organize.printings

import kotlinx.serialization.json.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

fun <T> JsonElement.objectSequence(key: String, transform: (Map.Entry<String, JsonElement>) -> T): Sequence<T> {
    val jsonElement = this.jsonObject[key]
    val jsonElement1 = jsonElement!!
    val jsonObject = jsonElement1.jsonObject
    val map = jsonObject.map(transform)
    val asSequence = map.asSequence()
    return asSequence
}

fun <T> JsonElement.arraySequence(key: String, transform: (JsonElement) -> T): Sequence<T> {
    val jsonElement = this.jsonObject[key]
    val jsonElement1 = jsonElement!!
    val jsonObject = jsonElement1.jsonArray
    val map = jsonObject.map(transform)
    val asSequence = map.asSequence()
    return asSequence
}

fun JsonElement.primitive(key: String): JsonPrimitive {
    val jsonElement = this.jsonObject[key]
    val jsonElement1 = jsonElement!!
    val jsonPrimitive = jsonElement1.jsonPrimitive
    return jsonPrimitive
}
fun JsonElement.string(key: String) = primitive(key).content
fun JsonElement.uuid(key: String) = UUID.fromString(this.string(key))!!
fun JsonElement.stringOpt(key: String, default: String = "") = try {

    this.string(key)
} catch (ignored: Exception) {
    default
}

fun JsonElement.boolean(key: String) = primitive(key).boolean
fun JsonElement.booleanOpt(key: String, default: Boolean = false) = try {
    this.boolean(key)
} catch (ignored: Exception) {
    default
}

fun JsonElement.int(key: String) = primitive(key).int
fun JsonElement.float(key: String) = primitive(key).float
fun JsonElement.floatOpt(key: String, default: Float = 0.0F) = try {
    this.float(key)
} catch (ignored: Exception) {
    default
}
fun JsonElement.intOpt(key: String) = try {
    this.int(key)
} catch (ignored: Exception) {
    Int.MIN_VALUE
}

fun JsonElement.date(key: String): LocalDate {
    return LocalDate.parse(this.string(key), DateTimeFormatter.ISO_DATE)!!
}