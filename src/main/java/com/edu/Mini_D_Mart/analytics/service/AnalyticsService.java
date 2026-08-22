package com.edu.Mini_D_Mart.analytics.service;

import com.edu.Mini_D_Mart.analytics.dto.StoreDashboardSummaryDto;
import com.edu.Mini_D_Mart.order.dto.OrderResponse;
import com.edu.Mini_D_Mart.order.entity.OrderStatus;
import com.edu.Mini_D_Mart.order.repository.OrderRepository;
import com.edu.Mini_D_Mart.product.repository.ProductRepository;
import com.edu.Mini_D_Mart.returns.dto.ReturnRequestResponse;
import com.edu.Mini_D_Mart.returns.entity.ReturnStatus;
import com.edu.Mini_D_Mart.returns.repository.ReturnRequestRepository;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final UserRepository userRepository;

    public AnalyticsService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            ReturnRequestRepository returnRequestRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.returnRequestRepository = returnRequestRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public StoreDashboardSummaryDto getDashboardSummary() {
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        long totalOrders = orderRepository.count();

        List<OrderStatus> completedStatuses = List.of(OrderStatus.DELIVERED, OrderStatus.PICKED_UP);
        long completedOrders = orderRepository.countByStatusIn(completedStatuses);

        List<OrderStatus> activeStatuses = List.of(
                OrderStatus.PLACED,
                OrderStatus.CONFIRMED,
                OrderStatus.PREPARING,
                OrderStatus.READY_FOR_PICKUP,
                OrderStatus.OUT_FOR_DELIVERY
        );
        long activeOrders = orderRepository.countByStatusIn(activeStatuses);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        long lowStockCount = productRepository.countLowStockProducts();
        long pendingReturnsCount = returnRequestRepository.countByStatus(ReturnStatus.PENDING);
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();

        double returnRate = 0.0;
        if (completedOrders > 0) {
            long completedReturns = returnRequestRepository.countByStatus(ReturnStatus.COMPLETED);
            returnRate = BigDecimal.valueOf((double) completedReturns / completedOrders * 100)
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        List<OrderResponse> recentOrders = orderRepository.findAllByOrderByPlacedAtDesc().stream()
                .limit(5)
                .map(OrderResponse::from)
                .toList();

        List<ReturnRequestResponse> recentReturns = returnRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(5)
                .map(ReturnRequestResponse::from)
                .toList();

        return new StoreDashboardSummaryDto(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalOrders,
                completedOrders,
                activeOrders,
                cancelledOrders,
                lowStockCount,
                pendingReturnsCount,
                totalProducts,
                totalUsers,
                returnRate,
                recentOrders,
                recentReturns
        );
    }
}
