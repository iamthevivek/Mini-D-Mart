package com.edu.Mini_D_Mart.order.dto;

import com.edu.Mini_D_Mart.order.entity.FulfillmentType;
import com.edu.Mini_D_Mart.order.entity.Order;
import com.edu.Mini_D_Mart.order.entity.OrderStatus;
import com.edu.Mini_D_Mart.order.entity.PaymentMethod;
import com.edu.Mini_D_Mart.order.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        Long userId,
        String userName,
        String userEmail,
        FulfillmentType fulfillmentType,
        OrderStatus status,
        BigDecimal subtotal,
        BigDecimal deliveryFee,
        BigDecimal discountAmount,
        BigDecimal taxAmount,
        BigDecimal totalAmount,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        String deliveryAddress,
        String deliveryCity,
        String deliveryPincode,
        String deliveryPhone,
        String deliveryInstructions,
        PickupSlotResponse pickupSlot,
        String pickupVerificationCode,
        String cancellationReason,
        String staffNotes,
        List<OrderItemResponse> items,
        int totalItems,
        Instant placedAt,
        Instant completedAt,
        Instant cancelledAt,
        boolean canCancel,
        boolean canReturn
) {

    public static OrderResponse from(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems() != null
                ? order.getItems().stream().map(OrderItemResponse::from).toList()
                : List.of();

        int totalItems = itemResponses.stream().mapToInt(OrderItemResponse::quantity).sum();

        boolean canCancel = order.getStatus() == OrderStatus.PLACED || order.getStatus() == OrderStatus.CONFIRMED;

        boolean canReturn = false;
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.PICKED_UP) {
            Instant referenceTime = order.getCompletedAt() != null ? order.getCompletedAt() : order.getPlacedAt();
            long daysSince = Duration.between(referenceTime, Instant.now()).toDays();
            canReturn = daysSince <= 7 && itemResponses.stream().anyMatch(i -> !i.isReturnedOrExchanged() && i.isReturnable());
        }

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getUser() != null ? order.getUser().getName() : null,
                order.getUser() != null ? order.getUser().getEmail() : null,
                order.getFulfillmentType(),
                order.getStatus(),
                order.getSubtotal(),
                order.getDeliveryFee(),
                order.getDiscountAmount(),
                order.getTaxAmount(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getDeliveryAddress(),
                order.getDeliveryCity(),
                order.getDeliveryPincode(),
                order.getDeliveryPhone(),
                order.getDeliveryInstructions(),
                order.getPickupSlot() != null ? PickupSlotResponse.from(order.getPickupSlot()) : null,
                order.getPickupVerificationCode(),
                order.getCancellationReason(),
                order.getStaffNotes(),
                itemResponses,
                totalItems,
                order.getPlacedAt(),
                order.getCompletedAt(),
                order.getCancelledAt(),
                canCancel,
                canReturn
        );
    }
}
