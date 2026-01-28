package com.evomotiv.repository

import com.evomotiv.model.LoadCarrier
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional

interface LoadCarrierRepository : JpaRepository<LoadCarrier, Long> {

    @Query("""
        select distinct lc
        from LoadCarrier lc
        where lc.deletedAt is null
        order by lc.id
    """)
    fun findAllActive(): List<LoadCarrier>

    @Query("""
        select lc
        from LoadCarrier lc
        where lc.id = :id and lc.deletedAt is null
    """)
    fun findActiveById(@Param("id") id: Long): Optional<LoadCarrier>

    @Query("""
        select lc
        from LoadCarrier lc
        where lc.qrCode = :qrCode and lc.deletedAt is null
    """)
    fun findActiveByQrCode(@Param("qrCode") qrCode: String): Optional<LoadCarrier>

    fun existsByQrCode(qrCode: String): Boolean
}