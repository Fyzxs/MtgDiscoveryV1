package organize

import Because
import org.joda.time.DateTime
import java.io.FileWriter
import java.nio.charset.Charset

object WriteOut {
    private const val ignoreDownloads = false
    const val dropTables = false
    const val downloadOnly = false
    private const val useConsole = false
    private const val directSql = false
    private val downloadList by lazy { FileWriter("downloadList.txt", false) }
    private val diff by lazy { FileWriter("diff.sql", Charset.forName("UTF-16"), false) }
    private val prices by lazy { FileWriter("prices.sql", Charset.forName("UTF-16"), false) }

    fun writePrices(sb: String){
        if(sb.isBlank()) return
        prices.write(sb)
        prices.write("----------" + System.lineSeparator())
        prices.flush()
    }
    fun writePrimary(sb: String) {
        work(sb)
    }
    fun writeExcluded(sb: String) {
        work(sb)
    }

    fun toDownload(sb: String) {
        if(ignoreDownloads)return
        if (useConsole && sb.isNotBlank()) println(sb)
        else {
            downloadList.write(sb)
            downloadList.write(System.lineSeparator())
        }
    }

    private val cache : MutableList<String> = mutableListOf()

    private fun work(sb: String, force : Boolean = false) {
        if(downloadOnly) return
        when {
            useConsole -> {
                if(sb.isBlank()) return
                println(sb)
            }
            directSql ->{
                cache.add(sb)
                if(cache.count() < 1000 && force.not()) return
                println(":::::::::::::::::::::::BEG Executing SQL:::::::::::::::::::::::")
                println("${DateTime.now()}")
                val runIt = cache.joinToString(System.lineSeparator())
                Because.Db.runCommand(runIt)
                cache.clear()
                println("${DateTime.now()}")
                println(":::::::::::::::::::::::END Executing SQL:::::::::::::::::::::::")
            }
            else -> {
                if(sb.isBlank()) return
                //Because.Db.runCommand(sb)
                //println(sb)
                diff.write(sb)
                diff.write("----------" + System.lineSeparator())
                diff.flush()
                //fileOut.write(System.lineSeparator() + "GO" + System.lineSeparator())
            }
        }
    }

    private fun flush() {
        downloadList.flush()
        diff.flush()
        prices.flush()
    }

    fun close(){
        flush()
        downloadList.close()
        diff.close()
        prices.close()
    }

    fun actualLocation() {
        //println(File("AllPrintings.sql").absolutePath)
    }
}