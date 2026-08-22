package com.edu.Mini_D_Mart.analytics.controller;

import com.edu.Mini_D_Mart.analytics.dto.StoreDashboardSummaryDto;
import com.edu.Mini_D_Mart.analytics.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/operations")
public class StoreOperationsController {

    private final AnalyticsService analyticsService;

    public StoreOperationsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<StoreDashboardSummaryDto> getOperationsSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }
}
