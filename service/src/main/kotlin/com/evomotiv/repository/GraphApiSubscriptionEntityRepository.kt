package com.evomotiv.repository

import com.evomotiv.model.GraphApiSubscriptionEntity
import org.springframework.data.jpa.repository.JpaRepository

interface GraphApiSubscriptionEntityRepository : JpaRepository<GraphApiSubscriptionEntity, String> {
}