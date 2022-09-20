
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction
import organize.*
import organize.printings.Card
import organize.printings.CardSet
import java.util.*
import kotlin.reflect.KCallable
import kotlin.reflect.KClass
import kotlin.reflect.full.declaredMemberProperties

object Because {

    object Db{
        val local by lazy {
            Database.connect(":LOOK MA - Bad practices!")
        }

        fun filterLocal(sql: String) = transaction(local) {
            if (WriteOut.downloadOnly) return@transaction false
            if (sql.isEmpty().not()) {
                return@transaction exec(sql) {
                    if (it.next()) {
                        return@exec true
                    }
                    return@exec false
                } == true
            }
            return@transaction false
        }

        fun runCommand(sql:String) = transaction(local){
            if(sql.isEmpty().not()) exec(sql)
        }
    }

    private fun selectKeyMatchCardSetExists(set: CardSet) = "SELECT * FROM [dbo].[CardSet] WHERE [actualCode]=${set.actualCode.forDb()}"
    fun actualCommandToRunCardSetExists(set: CardSet): String {
        //If exact, do nothing
        val sqlKey = selectKeyMatchCardSetExists(set)
        if(Db.filterLocal(sqlKey)){
            return ""
        }
        return "set does not exist yet"
    }

    inline fun <reified T : Any> actualCommandToRunNarrowData(kClass: KClass<T>, uuid: UUID, data: String): String {
        val tableName = kClass.simpleName!!
        if(Db.filterLocal(selectExactNarrowData(tableName, uuid, data))){
            return ""//If there's an exact match, exit
        }

        //Otherwise, insert
        return insertStatementNarrowData(tableName, uuid, data)
    }

    inline fun <reified T : Any> actualCommandToRunWideData(uuid: UUID, data: T): String {
        val kClass = T::class
        val tableName = kClass.simpleName!!
        val sqlExact = selectExactMatchWideData(tableName, uuid, kClass, data)
        if(Db.filterLocal(sqlExact)){
            //println("NOTHING:$sqlExact")
            return ""//If there's an exact match, do nothing
        }

        val sqlKey = selectKeyMatchWideData(tableName, uuid)
        if(Db.filterLocal(sqlKey)) {
            //println("UPDATE::$sqlKey")
            return updateStatementWideData(tableName, uuid, kClass, data)
        }


        val sqlInsert = insertStatementWideData(tableName, uuid, kClass, data)
        //println("INSERT::$sqlInsert")
        return sqlInsert
    }

    fun actualCommandToRunCard(card: Card, tableSuffix: String = ""): String {
        //If exact, do nothing
        val sqlExact = selectExactMatchCard(card, tableSuffix)
        if(Db.filterLocal(sqlExact)){
            //println("NOTHING:$sqlExact")
            return ""//If there's an exact match, do nothing
        }
        val sqlKey = selectKeyMatchCard(card, tableSuffix)
        if(Db.filterLocal(sqlKey)){
            //println("UPDATE::$sqlKey")
            //if partial, update
            return updateStatementCard(card, tableSuffix)
        }

        //can't find it - insert
        val sqlInsert = insertStatementCard(card, tableSuffix)
        //println("INSERT::$sqlInsert")
        return sqlInsert
    }

    fun actualCommandToRunCardSet(set: CardSet, tableSuffix: String = ""): String {
        //If exact, do nothing
        val sqlExact = selectExactMatchCardSet(set, tableSuffix)
        if(Db.filterLocal(sqlExact)){
            //println("NOTHING:$sqlExact")
            return ""
        }
        val sqlKey = selectKeyMatchCardSet(set, tableSuffix)
        if(Db.filterLocal(sqlKey)){
            //println("UPDATE::$sqlKey")
            //if partial, update
            return updateStatementCardSet(set, tableSuffix)
        }

        //can't find it - insert
        val sqlInsert = insertStatementCardSet(set, tableSuffix)
        //println("INSERT::$sqlInsert")
        return sqlInsert
    }


    fun actualCommandToRunCardSetProcessedHash(data : CardSetProcessedHash): String {
        //If exact, do nothing
        val sqlExact = selectExactMatchCardSetProcessedHash(data)
        if(Db.filterLocal(sqlExact)){
            //println("NOTHING:$sqlExact")
            return ""
        }
        val sqlKey = selectKeymatchCardSetProcessedHash(data)
        if(Db.filterLocal(sqlKey)){
            //println("UPDATE::$sqlKey")
            //if partial, update
            return updateCardSetProcessedHash(data)
        }

        //can't find it - insert
        val sqlInsert = insertStatementCardSetProcessedHash(data)
        //println("INSERT::$sqlInsert")
        return sqlInsert
    }

    data class CardSetProcessedHash(
        val setCode : String,
        val hash : String
    )
    fun selectExactMatchCardSetProcessedHash(data : CardSetProcessedHash) = "SELECT * FROM [dbo].[CardSetProcessedHash] WHERE [setCode]=${data.setCode.forDb()} and [hash]=${data.hash.forDb()}"
    fun selectKeymatchCardSetProcessedHash(data : CardSetProcessedHash) = "SELECT * FROM [dbo].[CardSetProcessedHash] WHERE [setCode]=${data.setCode.forDb()}"
    fun updateCardSetProcessedHash(data : CardSetProcessedHash) = "UPDATE [dbo].[CardSetProcessedHash] SET [hash]=${data.hash.forDb()} WHERE [setCode]=${data.setCode.forDb()}${System.lineSeparator()}"
    fun insertStatementCardSetProcessedHash(data : CardSetProcessedHash) = "INSERT INTO [dbo].[CardSetProcessedHash]([setCode], [hash]) VALUES (${data.setCode.forDb()}, ${data.hash.forDb()})${System.lineSeparator()}"


    fun insertStatementNarrowData(tableName: String, uuid: UUID, data: String) = "INSERT INTO [dbo].[${tableName}]([cardId], [data]) VALUES (${uuid.toString().forDb()}, ${data.forDb()})${System.lineSeparator()}"
    fun selectExactNarrowData(tableName: String, uuid: UUID, data: String) = "SELECT * FROM [dbo].[${tableName}] WHERE [cardId]=${uuid.toString().forDb()} and [data]=${data.forDb()}"


    fun selectKeyMatchWideData(tableName: String, uuid: UUID) = "select * from [dbo].[${tableName}] where [cardId]=${uuid.toString().forDb()}"
    inline fun <reified T : Any> insertStatementWideData(tableName: String, uuid: UUID, kClass: KClass<T>, data: T): String {
        val values = StringBuilder()
        return buildString {
            append("INSERT INTO [dbo].[$tableName]( [cardId]")
            values.append(uuid.toString().forDb())
            kClass.declaredMemberProperties.forEach newColumn@{ it ->
                if (!it.isColumnType()) return@newColumn

                append(", [${it.name}]")
                values.append(", ${it.valueConversion(data)}")
            }
            append(") VALUES (")
            append(values)
            appendLine(")")
        }
    }

    inline fun <reified T : Any> selectExactMatchWideData(tableName: String, uuid: UUID, kClass: KClass<T>, data: T): String {
        return buildString {
            append("SELECT * FROM [dbo].[$tableName] WHERE [cardId]=${uuid.toString().forDb()}")
            kClass.declaredMemberProperties.forEach newColumn@{ it ->
                if (!it.isColumnType()) return@newColumn
                append(" AND [${it.name}]=${it.valueConversion(data)}")
            }
        }
    }

    inline fun <reified T : Any> updateStatementWideData(tableName: String, uuid: UUID, kClass: KClass<T>, data: T): String {
        return buildString {
            append("UPDATE [dbo].[$tableName] SET [cardId]=${uuid.toString().forDb()}")
            kClass.declaredMemberProperties.forEach newColumn@{ it ->
                if (!it.isColumnType()) return@newColumn
                append(", [${it.name}]=${it.valueConversion(data)}")
            }
            appendLine(" WHERE [cardId]=${uuid.toString().forDb()}")
        }
    }

    private fun insertStatementCard(card: Card, tableSuffix: String) = insertStatements(Card::class, card, tableSuffix)
    private fun selectKeyMatchCard(card: Card, tableSuffix: String) = "select * from [dbo].[Card$tableSuffix] where [uuid]=${card.uuid.toString().forDb()} AND isExtendedSetCard = ${if(card.isExtendedSetCard) 1 else 0} AND isForcedFoilSet = ${if(card.isForcedFoilSet) 1 else 0}"


    private fun insertStatementCardSet(set: CardSet, tableSuffix: String) = insertStatements(CardSet::class, set, tableSuffix)
    private fun selectKeyMatchCardSet(set: CardSet, tableSuffix: String) = "select * from [dbo].[CardSet$tableSuffix] where [code]=${set.code.forDb()}"
    private inline fun <reified T : Any, reified K : Any> insertStatements(kClass: KClass<K>, item: T, tableSuffix: String): String {
        val tableName = kClass.simpleName + tableSuffix
        return buildString {
            append("INSERT INTO [dbo].[${tableName}](")
            val values = StringBuilder()
            var commaCtr = 0;
            kClass.declaredMemberProperties.forEach newColumn@{
                if (!it.isColumnType()) return@newColumn

                append("${comma(commaCtr)} [${it.name}]")

                val s = "${comma(commaCtr)}${it.valueConversion(item)}"
                values.append(s)
                commaCtr++
            }
            append(") VALUES (")
            append(values)
            appendLine(")")
        }
    }

    private fun updateStatementCard(card: Card, tableSuffix: String) = updateStatements(Card::class, card, "WHERE uuid=${card.uuid.toString().forDb()}  AND isExtendedSetCard = ${if (card.isExtendedSetCard) 1 else 0} AND isForcedFoilSet = ${if (card.isForcedFoilSet) 1 else 0}", tableSuffix)
    private fun updateStatementCardSet(set: CardSet, tableSuffix: String) = updateStatements(CardSet::class, set, "WHERE code=${set.code.forDb()}", tableSuffix)
    private inline fun <reified T : Any, reified K : Any> updateStatements(kClass: KClass<K>, item: T, whereClause: String, tableSuffix: String): String {
        val tableName = kClass.simpleName + tableSuffix
        return buildString {
            append("UPDATE [dbo].[${tableName}] SET ")
            var commaCtr = 0;
            kClass.declaredMemberProperties.forEach newColumn@{
                if (!it.isColumnType()) return@newColumn

                append("${comma(commaCtr)}[${it.name}]=${it.valueConversion(item)}")
                commaCtr++
            }
            appendLine(" $whereClause ")
        }
    }

    private fun selectExactMatchCard(card: Card, tableSuffix: String) = selectExactMatch(Card::class, card, tableSuffix)
    private fun selectExactMatchCardSet(set: CardSet, tableSuffix: String) = selectExactMatch(CardSet::class, set, tableSuffix)
    private inline fun <reified T : Any, reified K : Any> selectExactMatch(kClass: KClass<K>, item: T, tableSuffix: String): String {
        val tableName = kClass.simpleName + tableSuffix
        return buildString {
            append("SELECT * FROM [dbo].[$tableName] WHERE 1=1")
            kClass.declaredMemberProperties.forEach newColumn@{ it ->
                if (!it.isColumnType()) return@newColumn
                append(" AND [${it.name}]=${it.valueConversion(item)}")
            }
        }
    }

    fun comma(ctr: Int): String = if (ctr > 0) "," else ""




    fun KCallable<*>.isColumnType(): Boolean {
        //This ain't right, but not sure better
        return when (this.returnType.toString()) {
            "kotlin.String",
            "kotlin.Boolean",
            "kotlin.Int",
            "kotlin.Float",
            "java.time.LocalDate",
            "java.util.UUID" -> true
            else -> false
        }
    }


    fun KCallable<*>.valueConversion(obj: Any): String {
        val it = this
        val value = it.call(obj)
        return when (it.returnType.toString()) {
            "kotlin.String" -> (value as String).forDb()
            "kotlin.Boolean" -> if ((value as Boolean)) "1" else "0"
            "kotlin.Int" -> value.toString()
            "kotlin.Float" -> value.toString()
            "java.time.LocalDate" -> "'$value'"
            "java.util.UUID" -> "'$value'"
            else -> throw IllegalArgumentException("Unknown Type")
        }
    }

    fun String.forDb(): String = "'${this.replace("'", "''")}'"


    fun indexes(): String {
        val a = "CREATE NONCLUSTERED INDEX [nci_wi_Identifiers_BACE43610E57FB67A42D31DFFA747FC0] ON [dbo].[Identifiers] ([cardId]) INCLUDE ([cardKingdomFoilId], [cardKingdomId], [multiverseId], [scryfallId]) WITH (ONLINE = ON)"
        val b = "CREATE NONCLUSTERED INDEX [nci_wi_Card_51AFB4A774DEFAF013EF3292BDE24DE6] ON [dbo].[Card] ([isExtendedSetCard], [isForcedFoilSet], [uuid]) WITH (ONLINE = ON)"
        return ""
    }
}