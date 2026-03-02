package com.evomotiv.controller

import com.evomotiv.dto.*
import com.evomotiv.service.AnomalyService
import com.evomotiv.service.LoadCarrierRequestService
import com.evomotiv.service.WorkspaceService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "Workspace", description = "Workspace operations")
@RestController
@RequestMapping("/api/workspaces")
class WorkspaceController(
    private val loadCarrierRequestService: LoadCarrierRequestService,
    private val wbService: WorkspaceService,
    private val anomalyService: AnomalyService
) {
    @GetMapping("/all")
    fun getAll(): List<WorkspaceDto> =
        wbService.getAll()

    @GetMapping
    fun getActive(): List<WorkspaceDto> =
        wbService.getAllActive()

    @PostMapping
    fun create(@RequestBody body: CreateWorkspaceDto): WorkspaceDto =
        wbService.create(body.name, body.description)

    @PostMapping("/{id}/deactivate")
    fun deactivate(@PathVariable id: Long): WorkspaceDto =
        wbService.deactivate(id)

    /* ===================== */
    /* REQUESTS              */
    /* ===================== */

    @GetMapping("/{id}/requests")
    fun getRequests(@PathVariable id: Long): List<LoadCarrierRequestDto> =
        loadCarrierRequestService.getByWorkspace(id)

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
        anomalyService.getAllByWorkspace(id)

    @PostMapping("/{id}/anomalies")
    fun createAnomaly(
        @PathVariable id: Long,
        @RequestBody dto: CreateAnomalyDto
    ): AnomalyDto = anomalyService.createAnomaly(id, dto)








}