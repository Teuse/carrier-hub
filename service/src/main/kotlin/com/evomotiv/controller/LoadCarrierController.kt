package com.evomotiv.controller

import com.evomotiv.dto.CreateLoadCarrierDto
import com.evomotiv.dto.UpdateLoadCarrierDto
import com.evomotiv.service.LoadCarrierService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/load-carriers")
@Tag(name = "LoadCarriers", description = "CRUD for load carrier templates")
class LoadCarrierController(
    private val service: LoadCarrierService
) {

    @GetMapping
    fun getAllActive() = service.getAllActive()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = service.getById(id)

    @GetMapping("/by-code/{qrCode}")
    fun getByQrCode(@PathVariable qrCode: String) = service.getByQrCode(qrCode)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody dto: CreateLoadCarrierDto) = service.create(dto)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody dto: UpdateLoadCarrierDto) =
        service.update(id, dto)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) = service.softDelete(id)
}