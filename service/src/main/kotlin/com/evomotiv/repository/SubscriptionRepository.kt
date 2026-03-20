package com.evomotiv.repository

import com.evomotiv.model.GraphApiSubscriptionEntity
import com.microsoft.graph.models.Subscription
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository
import java.util.Optional

/**
 * This is basically an adapter to persist microsofts GraphAPI-Subscription entity into our database.
 */
@Repository
class  SubscriptionRepository {
    @Autowired
    lateinit var repository: GraphApiSubscriptionEntityRepository

    @Override
    fun save(sub: Subscription): Subscription {
        val entity = GraphApiSubscriptionEntity.fromSubscription(sub)
        return repository.save(entity).toSubscription()
    }

    @Override
    fun findById(id: String): Optional<Subscription?>? {
        return repository.findById(id).map { it.toSubscription() }
    }

    @Override
    fun findAll(): List<Subscription> {
        return repository.findAll().map { it.toSubscription() }
    }

    @Override
    fun deleteById(id: String) {
        repository.deleteById(id)
    }
}