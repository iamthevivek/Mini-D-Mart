package com.edu.Mini_D_Mart.analytics.controller;

import com.edu.Mini_D_Mart.analytics.dto.StoreDashboardSummaryDto;
import com.edu.Mini_D_Mart.analytics.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<StoreDashboardSummaryDto> getSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }
}
