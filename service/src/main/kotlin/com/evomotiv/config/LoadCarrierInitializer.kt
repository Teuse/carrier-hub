package com.evomotiv.init

import com.evomotiv.model.Item
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
                description = "For screws, clips and small components",
                items = listOf(
                    ItemSpec("Screws M4", 200),
                    ItemSpec("Plastic clips", 100)
                )
            ),
            carrier(
                name = "Medium Assembly Carrier",
                description = "Standard assembly load carrier",
                items = listOf(
                    ItemSpec("Brackets", 20),
                    ItemSpec("Bolts M8", 50)
                )
            ),
            carrier(
                name = "Electrical Components Carrier",
                description = "Sensitive electrical components",
                items = listOf(
                    ItemSpec("Wiring harness", 10),
                    ItemSpec("Control units", 5)
                )
            ),
            carrier(
                name = "Heavy Parts Carrier",
                description = "Heavy mechanical parts",
                items = listOf(
                    ItemSpec("Gear housing", 2),
                    ItemSpec("Drive shafts", 4)
                )
            ),
            carrier(
                name = "Mixed Kit Carrier",
                description = "Pre-packed mixed assembly kit",
                items = listOf(
                    ItemSpec("Assembly kit A", 1),
                    ItemSpec("Assembly kit B", 1)
                )
            )
        )

        loadCarrierRepository.saveAll(carriers)
        log.info("✅ Initialized {} example load carriers", carriers.size)
    }

    /* ====================================================== */

    private data class ItemSpec(
        val name: String,
        val count: Int,
        val description: String? = null
    )

    private fun carrier(
        name: String,
        description: String,
        items: List<ItemSpec>
    ): LoadCarrier {
        val lc = LoadCarrier(
            name = name,
            description = description,
            qrCode = QrCodeGenerator.generate()
        )

        items.forEach { spec ->
            lc.items.add(
                Item(
                    loadCarrier = lc,
                    name = spec.name,
                    description = spec.description,
                    count = spec.count
                )
            )
        }

        return lc
    }
}