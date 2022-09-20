import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.4.21"
    kotlin("plugin.serialization") version "1.4.21"
    application
}

group = "me.quinn.gil"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    implementation("com.github.kittinunf.fuel:fuel:2.3.1")
    implementation("commons-io:commons-io:2.8.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.0.1")
    //implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.4.2")
    //implementation("com.github.kittinunf.fuel:fuel-coroutines:2.3.1")
    testImplementation(kotlin("test-junit"))
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