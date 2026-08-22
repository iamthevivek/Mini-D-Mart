package com.edu.Mini_D_Mart.order.repository;

import com.edu.Mini_D_Mart.order.entity.FulfillmentType;
import com.edu.Mini_D_Mart.order.entity.Order;
import com.edu.Mini_D_Mart.order.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByUserIdOrderByPlacedAtDesc(Long userId);

    Optional<Order> findByOrderNumber(String orderNumber);

    Optional<Order> findByOrderNumberAndUserId(String orderNumber, Long userId);

    List<Order> findAllByOrderByPlacedAtDesc();

    List<Order> findAllByStatusInOrderByPlacedAtAsc(List<OrderStatus> statuses);

    List<Order> findAllByFulfillmentTypeAndStatusInOrderByPlacedAtAsc(FulfillmentType fulfillmentType, List<OrderStatus> statuses);

    long countByStatus(OrderStatus status);

    long countByStatusIn(List<OrderStatus> statuses);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status NOT IN ('CANCELLED') AND o.paymentStatus = 'PAID'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.placedAt >= :since")
    long countOrdersSince(@Param("since") Instant since);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.placedAt >= :since AND o.status NOT IN ('CANCELLED') AND o.paymentStatus = 'PAID'")
    BigDecimal calculateRevenueSince(@Param("since") Instant since);

    Optional<Order> findByPickupVerificationCodeAndStatus(String code, OrderStatus status);
}
