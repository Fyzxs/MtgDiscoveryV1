package organize.printings

import organize.*
import organize.printings.wide.CardForeignDatum
import organize.printings.wide.CardPurchaseUrls
import organize.printings.wide.Identifiers
import kotlin.reflect.KCallable
import kotlin.reflect.KClass
import kotlin.reflect.full.declaredMemberProperties

fun scriptTables() {
    if(WriteOut.dropTables.not()) return

    arrayOf(
        CardSet::class,
        Card::class
    )
        .forEach {
            WriteOut.writeExcluded(createTable(it, "_Excluded"))

            WriteOut.writePrimary(createTable(it))
        }
    arrayOf(
        CardForeignDatum::class,
        CardPurchaseUrls::class,
        Identifiers::class
    )
        .forEach {
            WriteOut.writePrimary(createCardWideDataTable(it))
            WriteOut.writePrimary(System.lineSeparator())
            WriteOut.writePrimary(System.lineSeparator())
        }

    arrayOf(
        CardForeignData::class,
        CardOtherFaceIds::class,
        CardTypes::class,
        CardSupertypes::class,
        CardSubtypes::class,
        CardPrintings::class,
        ReverseRelatedCards::class,
        CardKeywords::class,
        CardAvailabilities::class,
        CardPromoTypes::class,
        CardColorIdentities::class,
        CardColorIndicators::class,
        CardColors::class,
        CardFrameEffects::class,
        Translations::class
    )
        .forEach {
            WriteOut.writePrimary(createCardNarrowDataTable(it))
            WriteOut.writePrimary(System.lineSeparator())
            WriteOut.writePrimary(System.lineSeparator())
        }


    WriteOut.writePrimary(customTableCreationForCardVariations())
}

fun customTableCreationForCardVariations(tableSuffix: String = ""): String {
    val kClass = CardVariations::class
    return buildString {
        createTablePrefix(kClass, tableSuffix)
        appendLine(", [cardId] [uniqueidentifier] NOT NULL")
        appendLine(", [data] [uniqueidentifier] NOT NULL")
        createTableSuffix()
    }
}

private fun <T : Any> createCardNarrowDataTable(kClass: KClass<T>, tableSuffix: String = ""): String {
    return buildString {
        createTablePrefix(kClass, tableSuffix)
        appendLine(", [cardId] [uniqueidentifier] NOT NULL")
        appendLine(", [data] [nvarchar](max) NOT NULL")
        createTableSuffix()
    }
}

fun <T : Any> createCardWideDataTable(kClass: KClass<T>, tableSuffix: String = ""): String {
    return buildString {
        createTablePrefix(kClass, tableSuffix)
        appendLine(", [cardId] [uniqueidentifier] NOT NULL")
        createTableColumns(kClass)
        createTableSuffix()
    }
}

private fun StringBuilder.createTableSuffix() {
    appendLine(") ON [PRIMARY]")
}

private fun <T : Any> StringBuilder.createTableColumns(kClass: KClass<T>) {
    kClass.declaredMemberProperties.forEach newColumn@{
        if (it.isColumnType()) appendLine(", [${it.name}] ${it.dbType()}")
    }
}

private fun <T : Any> StringBuilder.createTablePrefix(kClass: KClass<T>, tableSuffix: String) {
    val tableName = kClass.simpleName + tableSuffix
    appendLine(
        """IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[$tableName]') AND type in (N'U'))
DROP TABLE [dbo].[$tableName]"""
    )
    appendLine("CREATE TABLE [dbo].[$tableName](")
    appendLine("[id] [int] IDENTITY(1,1) NOT NULL")
}

private fun <T : Any> createTable(kClass: KClass<T>, tableSuffix: String = ""): String {
    return buildString {
        createTablePrefix(kClass, tableSuffix)
        createTableColumns(kClass)
        createTableSuffix()
    }
}

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

fun KCallable<*>.dbType(): String {
    return when (this.returnType.toString()) {
        "kotlin.String" -> "[nvarchar](${nvarcharLength(this)}) NOT NULL"
        "kotlin.Boolean" -> "[bit] NOT NULL"
        "kotlin.Int" -> "[int] NOT NULL"
        "kotlin.Float" -> "[decimal] NOT NULL"
        "java.time.LocalDate" -> "[datetime2](7) NOT NULL"
        "java.util.UUID" -> "[uniqueidentifier] NOT NULL"
        else -> this.returnType.toString()
    }
}
fun nvarcharLength(kCallable: KCallable<*>): String {
    return when(kCallable.name.toLowerCase()){
        "text" -> "1024"
        "originaltext" -> "1024"
        "flavortext" -> "512"
        "name" -> "256"
        "asciiname" -> "256"
        "artist" -> "128"
        "originaltype" -> "128"
        "type" -> "128"
        "manacost" -> "128"
        "uuid" -> "64"
        "faceName" -> "64"
        "watermark" -> "64"
        "setType" -> "64"
        "keyruneCode" -> "64"
        "layout" -> "64"
        "borderColor" -> "64"
        "number" -> "64"
        "rarity" -> "64"
        "convertedManaCost" -> "64"
        "setCode" -> "64"
        "frameVersion" -> "64"
        "loyalty" -> "64"
        "id" -> "64"
        "life" -> "64"
        "toughness" -> "64"
        "hand" -> "64"
        "actualname" -> "64"
        "mcmName" -> "64"
        "releaseDate" -> "64"
        "block" -> "64"
        "actualType" -> "64"
        "mcmId" -> "64"
        "code" -> "64"
        "actualCode" -> "64"
        "parentCode" -> "64"
        //data -- Used too often to know a good set for the future. Mostly because "Translations" is not populated
        else -> "max"
    }
}


fun indexes() : String{
    return "CREATE NONCLUSTERED INDEX [nci_wi_Identifiers_BACE43610E57FB67A42D31DFFA747FC0] ON [dbo].[Identifiers] ([cardId]) INCLUDE ([cardKingdomFoilId], [cardKingdomId], [multiverseId], [scryfallId]) WITH (ONLINE = ON)" +
            "--CREATE NONCLUSTERED INDEX [nci_wi_CardPurchaseUrls_47071CE93BB84FF4E75C689FEBBD7C77] ON [dbo].[CardPurchaseUrls] ([cardId]) WITH (ONLINE = ON)" +
            "CREATE NONCLUSTERED INDEX [nci_wi_Identifiers_47071CE93BB84FF4E75C689FEBBD7C77] ON [dbo].[Identifiers] ([cardId]) WITH (ONLINE = ON)"
}