package com.edu.Mini_D_Mart.analytics.dto;

import com.edu.Mini_D_Mart.order.dto.OrderResponse;
import com.edu.Mini_D_Mart.returns.dto.ReturnRequestResponse;

import java.math.BigDecimal;
import java.util.List;

public record StoreDashboardSummaryDto(
        BigDecimal totalRevenue,
        long totalOrders,
        long completedOrders,
        long activeOrders,
        long cancelledOrders,
        long lowStockCount,
        long pendingReturnsCount,
        long totalProducts,
        long totalUsers,
        double returnRatePercent,
        List<OrderResponse> recentOrders,
        List<ReturnRequestResponse> recentReturns
) {
}
