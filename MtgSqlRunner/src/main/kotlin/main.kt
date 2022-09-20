import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File
import java.io.FileReader
import java.nio.charset.Charset
import java.util.*

object Db {

    val dataStoreRemote by lazy {
        Database.connect("Look Ma - Bad Practices!")    }
    val dataStoreLocal by lazy {
        Database.connect("Look Ma - Bad Practices!")    }
    }

    fun run(sql: String, datastore: Database): Boolean = transaction(datastore) {
        if (sql.isEmpty().not()) {
            exec(sql)
        }
        return@transaction false
    }
}


fun main(args: Array<String>) {
    val fileToProcess = args[0]
    val system = args[1]
    println("Running against [system=$system]")
    if("local".equals(system)) {
        val delimCountLocal = runOnDatabase(fileToProcess, Db.dataStoreLocal, "local")
        println("Completed executing all statements Against Local. [delimCount=$delimCountLocal]")
    }
    else if("live".equals(system)) {
        val delimCountRemote = runOnDatabase(fileToProcess, Db.dataStoreRemote, "server")
        println("Completed executing all statements Against Remote. [delimCount=$delimCountRemote]")
    }
}

private fun runOnDatabase(fileToProcess: String, database: Database, runningText : String ): Int {
    val file = FileReader(fileToProcess, Charset.forName("UTF-16"))
    println("counting statements")
    var ctr = 0
    val delimiter = "----------"
    file.forEachLine {
        if (it == delimiter) {
            ctr += 1
        }
    }
    println("Found about [$ctr] Commands to execute")
    val diff = File(fileToProcess)
    val sc = Scanner(diff, Charset.forName("UTF-16"));

    sc.useDelimiter(delimiter)
    var executed = 0
    var delimCount = 0
    while (sc.hasNext()) {
        val line = sc.next()
        if (line == delimiter) {
            delimCount++
            continue
        }
        try {
            Db.run(line, database)
        } catch (cause: Throwable) {
            println("IT BROKE - " + cause.message)
            println(line)
            println(cause.stackTraceToString())
            throw cause
        }
        executed++
        println("Executed ${executed.toString().padStart(6)} of $ctr statements on $runningText")
    }
    sc.close()
    return delimCount
}

