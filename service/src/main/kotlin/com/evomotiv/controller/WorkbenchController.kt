package com.evomotiv.controller

import com.evomotiv.dto.*
import com.evomotiv.service.AnomalyService
import com.evomotiv.service.LoadCarrierRequestService
import com.evomotiv.service.WorkbenchService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "Workbench", description = "Workbench operations")
@RestController
@RequestMapping("/api/workbenches")
class WorkbenchController(
    private val loadCarrierRequestService: LoadCarrierRequestService,
    private val wbService: WorkbenchService,
    private val anomalyService: AnomalyService
) {
    @GetMapping("/all")
    fun getAll(): List<WorkbenchDto> =
        wbService.getAll()

    @GetMapping
    fun getActive(): List<WorkbenchDto> =
        wbService.getAllActive()

    @PostMapping
    fun create(@RequestBody body: CreateWorkbenchDto): WorkbenchDto =
        wbService.create(body.name, body.description)

    @PostMapping("/{id}/deactivate")
    fun deactivate(@PathVariable id: Long): WorkbenchDto =
        wbService.deactivate(id)

    /* ===================== */
    /* REQUESTS              */
    /* ===================== */

    @GetMapping("/{id}/requests")
    fun getRequests(@PathVariable id: Long): List<LoadCarrierRequestDto> =
        loadCarrierRequestService.getByWorkbench(id)

    @PostMapping("/{id}/requests")
    fun createRequest(
        @PathVariable id: Long,
        @RequestBody dto: CreateLoadCarrierRequestDto
    ): LoadCarrierRequestDto =
        loadCarrierRequestService.createRequest(id, dto)

    /* ===================== */
    /* ANOMALIES             */
    /* ===================== */

    @GetMapping("/{id}/anomalies")
    fun getAnomalies(@PathVariable id: Long): List<AnomalyDto> =
        anomalyService.getAllByWorkbench(id)

    @PostMapping("/{id}/anomalies")
    fun createAnomaly(
        @PathVariable id: Long,
        @RequestBody dto: CreateAnomalyDto
    ): AnomalyDto = anomalyService.createAnomaly(id, dto)








}