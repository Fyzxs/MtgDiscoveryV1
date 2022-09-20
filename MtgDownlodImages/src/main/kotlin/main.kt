import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import org.apache.commons.io.FileUtils
import java.io.File
import java.io.FileReader
import java.net.URL


val format = Json { this.ignoreUnknownKeys = true }

@Serializable
data class Root(val data: List<SetInfo>)

@Serializable
data class SetInfo(
    val code: String,
    val icon_svg_uri: String
)

internal object LaunchFlags{
    var newOnly = true;
}

fun main(args: Array<String>) {
    LaunchFlags.newOnly = args.isEmpty() || (args[0] == "replaceAll").not()

    downloadImages()
    downloadSets()
}

fun downloadSets() {
    FileUtils.copyURLToFile(URL("https://api.scryfall.com/sets"), File("sets.json"))
    val fileReader = FileReader("sets.json")
    val root = format.decodeFromString<Root>(fileReader.readText())

    root.data.forEach {
        setImage(it, "downloads\\setIcons\\")
        setImageWord(it, "downloads\\setName\\")
    }
}

private fun setImage(setInfo: SetInfo, prefix: String) {
    val setCode = if (setInfo.code.toLowerCase() == "con") "_con" else setInfo.code
    val file = File("${prefix}$setCode.svg")
    val url = URL(setInfo.icon_svg_uri)
    try{
        val remoteFile = File(url.file.subSequence(0, url.file.indexOf('?')).toString()).name
        //FileUtils.copyURLToFile(url, file)
        FileUtils.copyURLToFile(url, File(prefix + remoteFile))
        println(setInfo.icon_svg_uri)
    } catch (ignored: Exception) {
        println("Unable to get setImage [$url]")
    }
}

private fun setImageWord(setInfo: SetInfo, prefix: String) {

    val url = URL("http://mtgen.net/${setInfo.code.toLowerCase()}/images/logo-word.png")
    try {
        val file = File("${prefix}${setInfo.code}_name.png")
        FileUtils.copyURLToFile(url, file)
        println(url)
    }catch(ignored: Exception){
        println("Unable to get name [$url]")
    }
}

val failed = mutableListOf<String>()
private fun downloadImages() {
    val file = File("downloadList.txt")
   file.forEachLine {
        doTheDownload(it)
    }
    processFailures()

}

fun processFailures() {
    var counter = 0
    val max = failed.count() * 10
    while(failed.count() > 0 && counter < max){
        val line = failed.removeAt(0)
        doTheDownload(line)
        counter++
    }
}

private fun doTheDownload(it: String) {
    val split = it.split(",")
    if (split.size != 2) return
    try {
        if (download(split[0].toLowerCase(), split[1].toLowerCase())) {
            println("Downloaded ${split[0]}")
        } else {
            print(".")
        }
    } catch (ignored: Exception) {
        failed.add(it)
        println("Something Happened downloading ${split[0]} from ${split[1]}")
    }
}

fun download(disk: String, url: String): Boolean {
    val fsck = disk.replace("con/", "con_/")
    val file = File("downloads\\${fsck.toLowerCase()}")
    file.parentFile.mkdirs()
    if (file.exists() && 1000 < file.length() && LaunchFlags.newOnly) {
        return false
    }
    FileUtils.copyURLToFile(URL(url), file)
    return true
}


/*
fun download(disk: String, url: String): CancellableRequest? {
    val file = File("downloads\\${disk.toLowerCase()}")
    if(file.exists() && 1000 < file.length()){
        return null
    }
    file.parentFile.mkdirs()
    return url.httpDownload()
        .fileDestination { _, _ -> file }
        .response { a ->
            if(a.component1() == null) println("Unable to download ${url}")
            else println("Downloaded $disk :: ${a.component1()?.size}")
        }
}*/
