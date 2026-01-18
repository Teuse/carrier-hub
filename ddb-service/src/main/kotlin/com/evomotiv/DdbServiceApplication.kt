package com.evomotiv

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DdbServiceApplication

fun main(args: Array<String>) {
	runApplication<DdbServiceApplication>(*args)
}
