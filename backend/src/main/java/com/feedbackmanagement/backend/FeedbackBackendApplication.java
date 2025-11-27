package com.feedbackmanagement.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.r2dbc.R2dbcAutoConfiguration;

@SpringBootApplication(exclude = {R2dbcAutoConfiguration.class})
public class FeedbackBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeedbackBackendApplication.class, args);
        System.out.println("Feedback Management Backend is running...");
    }
}
