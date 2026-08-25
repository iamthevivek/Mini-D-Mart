package com.edu.Mini_D_Mart.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "OneMart Backend");
        response.put("timestamp", Instant.now().toString());

        // Touching the database connection wakes up / keeps active Neon DB
        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(2);
            response.put("database", isValid ? "CONNECTED" : "UNAVAILABLE");
        } catch (Exception e) {
            response.put("database", "DOWN (" + e.getMessage() + ")");
        }

        return ResponseEntity.ok(response);
    }
}
