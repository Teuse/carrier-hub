package com.evomotiv.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun openAPI(): OpenAPI =
        OpenAPI()
            .info(
                Info()
                    .title("Load Carrier Management API")
                    .description(
                        """
                        Backend API for:
                        - Workbench load carrier requests
                        - Logistics transport orders
                        - Warehouse tasks
                        """.trimIndent()
                    )
                    .version("1.0.0")
            )
}