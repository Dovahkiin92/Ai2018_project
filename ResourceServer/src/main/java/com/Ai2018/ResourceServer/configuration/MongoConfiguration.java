package com.Ai2018.ResourceServer.configuration;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

public class MongoConfiguration {
    @Value("${spring.data.mongodb.host}") String DB_HOST;
    @Value("${spring.data.mongodb.port}") int DB_PORT;
    @Value("${spring.data.mongodb.database}") String DB_NAME;
@Autowired
    PasswordEncoder passwordEncoder;
    @Bean
    public MongoClient mongo() {
        return MongoClients.create("mongodb://"+DB_HOST+":"+ DB_PORT);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient,DB_NAME);
    }

}
