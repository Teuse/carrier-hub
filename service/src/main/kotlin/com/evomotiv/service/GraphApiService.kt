package com.evomotiv.service;

import com.microsoft.graph.serviceclient.GraphServiceClient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service;

@Service
public class GraphApiService(
    private val delegatedGraphServiceClient: GraphServiceClient
) {
    private val listId = "07d554ce68594933ab8a790167192031_971099f285185b91"
    // -> copied value from my browser. I need to find a way to get and inject this dynamically. But how to identify the list?!


    fun createNewList(): Unit = TODO()

    fun enterItem(): Unit = TODO()

    fun updateItem(): Unit = TODO()

    fun deleteItem(): Unit = TODO()

    fun getLists(): Unit {
        delegatedGraphServiceClient.me().get()
    }

    /*
    I will need to build logic for the sync-up. I need to compare the list items against
    the anomalies in the database or at least against the recently updated ones.
    Depending on the number of anomalies, I could also consider making this async
     */
}
