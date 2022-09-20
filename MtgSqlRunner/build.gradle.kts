import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.4.21"
    application
}

val exposed_version="0.25.1"
group = "me.quinn.gil"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    jcenter()
}

dependencies {

    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.0.1")
    implementation("org.jetbrains.kotlin:kotlin-reflect:1.4.21")

    implementation("com.microsoft.sqlserver:mssql-jdbc:6.4.0.jre7")
    implementation("org.jetbrains.exposed:exposed-core:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-dao:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-jodatime:$exposed_version")

    testImplementation(kotlin("test-junit"))
    annotationProcessor("android.arch.persistence.room:compiler:1.1.1")
}

tasks.test {
    useJUnit()
}

tasks.withType<KotlinCompile>() {
    kotlinOptions.jvmTarget = "13"
}

tasks.withType<Jar>() {
    manifest {
        attributes["Main-Class"] = "MainKt"
    }
    configurations["compileClasspath"].forEach { file: File ->
//        from(if(file.isDirectory()) file else zipTree(file) ){
//            exclude("META-INF/*.RSA", "META-INF/*.SF", "META-INF/*.DSA")
//        }
        from(zipTree(file.absoluteFile)){
            exclude("META-INF/*.RSA", "META-INF/*.SF", "META-INF/*.DSA")
        }
    }
}


application { mainClass.set("MainKt") }