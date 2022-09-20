package config


object ConfigManager{
    val isLocal : Boolean = System.getenv("LOCAL_ENV") == "LOCAL"
    val isDev : Boolean = System.getenv("RELEASE_ENV") == null || System.getenv("RELEASE_ENV") == "DEV"
    val isProd : Boolean = System.getenv("RELEASE_ENV") == "PROD"
    val dbConfig = if(isLocal) DbConfigLocal else DbConfigRemote
    val authConfig = if(isLocal) AuthConfigLocal else AuthConfigRemote
}

interface DbConfig{
    val url: String
    val user: String
    val password: String
}
interface AuthConfig{
    val secret: String
    val issuer: String
    val realm: String
    val validityInMs: Int
}
private object DbConfigLocal : DbConfig{
    override val url = "<NOPE>"
    override val user = "<USER>>"
    override val password = "<PASSWORD>"
}

private object AuthConfigLocal : AuthConfig{
    override val secret = "Does not matter"
    override val issuer = "That guy over there"
    override val realm = "dream land"
    override val validityInMs = 999_999_999
}

private object DbConfigRemote : DbConfig{
    override val url = System.getenv("SQLCONNSTR_MTG_DB_CS")!!
    override val user = System.getenv("CUSTOMCONNSTR_MTG_DB_USER")!!
    override val password = System.getenv("CUSTOMCONNSTR_MTG_DB_PASSWORD")!!
}

private object AuthConfigRemote : AuthConfig{
    override val secret = System.getenv("AUTH_SECRET")!!
    override val issuer = System.getenv("AUTH_ISSUER")!!
    override val realm = System.getenv("AUTH_REALM")!!
    override val validityInMs = System.getenv("AUTH_EXPIRATION")!!.toInt()
}