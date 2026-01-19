package com.evomotiv.controller

import com.evomotiv.dto.CreateLoadCarrierRequestDto
import com.evomotiv.dto.LoadCarrierRequestDto
import com.evomotiv.mapper.LoadCarrierRequestMapper
import com.evomotiv.model.Workbench
import com.evomotiv.service.LoadCarrierRequestService
import com.evomotiv.service.WorkbenchService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "Workbench", description = "Workbench operations")
@RestController
@RequestMapping("/api/workbenches")
class WorkbenchController(
    private val loadCarrierRequestService: LoadCarrierRequestService,
    private val wbService: WorkbenchService
) {

    @PostMapping("/{id}/requests")
    fun createRequest(
        @PathVariable id: Long,
        @RequestBody dto: CreateLoadCarrierRequestDto
    ): LoadCarrierRequestDto =
        LoadCarrierRequestMapper.toDto(
            loadCarrierRequestService.createRequest(id, dto)
        )

    @GetMapping("/{id}/requests")
    fun getRequests(@PathVariable id: Long): List<LoadCarrierRequestDto> =
        loadCarrierRequestService.getByWorkbench(id)
            .map(LoadCarrierRequestMapper::toDto)

    @GetMapping
    fun getActive(): List<Workbench> =
        wbService.getAllActive()

    @GetMapping("/all")
    fun getAll(): List<Workbench> =
        wbService.getAll()

    data class CreateWorkbenchRequest(
        val name: String,
        val description: String? = null
    )

    @PostMapping
    fun create(@RequestBody body: CreateWorkbenchRequest): Workbench =
        wbService.create(body.name, body.description)

    @PostMapping("/{id}/deactivate")
    fun deactivate(@PathVariable id: Long): Workbench =
        wbService.deactivate(id)
}