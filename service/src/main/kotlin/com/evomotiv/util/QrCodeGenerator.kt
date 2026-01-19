package com.evomotiv.util

import java.util.UUID

object QrCodeGenerator {

    fun generate(): String =
        "LC-" + UUID.randomUUID()
            .toString()
            .substring(0, 8)
            .uppercase()
}