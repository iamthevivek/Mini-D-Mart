package com.edu.Mini_D_Mart.returns.dto;

import com.edu.Mini_D_Mart.order.dto.OrderItemResponse;
import com.edu.Mini_D_Mart.product.dto.ProductResponse;
import com.edu.Mini_D_Mart.returns.entity.ReturnReason;
import com.edu.Mini_D_Mart.returns.entity.ReturnRequest;
import com.edu.Mini_D_Mart.returns.entity.ReturnStatus;
import com.edu.Mini_D_Mart.returns.entity.ReturnType;

import java.math.BigDecimal;
import java.time.Instant;

public record ReturnRequestResponse(
        Long id,
        String requestNumber,
        Long orderId,
        String orderNumber,
        OrderItemResponse orderItem,
        Long userId,
        String userName,
        String userEmail,
        ReturnType type,
        ReturnReason reason,
        String details,
        String imageEvidenceUrl,
        ProductResponse exchangeProduct,
        ReturnStatus status,
        BigDecimal refundAmount,
        String staffReviewNotes,
        String reviewedByName,
        boolean restockItem,
        Instant createdAt,
        Instant updatedAt
) {

    public static ReturnRequestResponse from(ReturnRequest request) {
        return new ReturnRequestResponse(
                request.getId(),
                request.getRequestNumber(),
                request.getOrder() != null ? request.getOrder().getId() : null,
                request.getOrder() != null ? request.getOrder().getOrderNumber() : null,
                request.getOrderItem() != null ? OrderItemResponse.from(request.getOrderItem()) : null,
                request.getUser() != null ? request.getUser().getId() : null,
                request.getUser() != null ? request.getUser().getName() : null,
                request.getUser() != null ? request.getUser().getEmail() : null,
                request.getType(),
                request.getReason(),
                request.getDetails(),
                request.getImageEvidenceUrl(),
                request.getExchangeProduct() != null ? ProductResponse.from(request.getExchangeProduct()) : null,
                request.getStatus(),
                request.getRefundAmount(),
                request.getStaffReviewNotes(),
                request.getReviewedBy() != null ? request.getReviewedBy().getName() : null,
                request.isRestockItem(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}
