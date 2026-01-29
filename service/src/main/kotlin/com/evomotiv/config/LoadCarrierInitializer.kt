package com.evomotiv.config

import com.evomotiv.model.LoadCarrier
import com.evomotiv.repository.LoadCarrierRepository
import com.evomotiv.util.QrCodeGenerator
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@Profile("dev")
@Configuration
class LoadCarrierInitializer {

    private val log = LoggerFactory.getLogger(javaClass)

    @Bean
    fun initLoadCarriers(
        loadCarrierRepository: LoadCarrierRepository
    ) = ApplicationRunner {

        val count = loadCarrierRepository.count()
        if (count > 0L) {
            log.info("Load carriers already exist (count={}) – skipping initialization", count)
            return@ApplicationRunner
        }

        val carriers = listOf(
            carrier(
                name = "Small Parts Carrier",
                description = "For screws, clips and small components"
            ),
            carrier(
                name = "Medium Assembly Carrier",
                description = "Standard assembly load carrier"
            ),
            carrier(
                name = "Electrical Components Carrier",
                description = "Sensitive electrical components"
            ),
            carrier(
                name = "Heavy Parts Carrier",
                description = "Heavy mechanical parts"
            ),
            carrier(
                name = "Mixed Kit Carrier",
                description = "Pre-packed mixed assembly kit"
            )
        )

        loadCarrierRepository.saveAll(carriers)
        log.info("✅ Initialized {} example load carriers", carriers.size)
    }

    /* ====================================================== */

    private fun carrier(
        name: String,
        description: String,
    ): LoadCarrier {
        return LoadCarrier(
            name = name,
            description = description,
            qrCode = QrCodeGenerator.generate()
        )
    }
}