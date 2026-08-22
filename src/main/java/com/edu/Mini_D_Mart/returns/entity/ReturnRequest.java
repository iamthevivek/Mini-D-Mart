package com.edu.Mini_D_Mart.returns.entity;

import com.edu.Mini_D_Mart.order.entity.Order;
import com.edu.Mini_D_Mart.order.entity.OrderItem;
import com.edu.Mini_D_Mart.product.entity.Product;
import com.edu.Mini_D_Mart.user.entity.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
        name = "return_requests",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_returns_number", columnNames = "requestNumber")
        },
        indexes = {
                @Index(name = "idx_returns_user", columnList = "user_id"),
                @Index(name = "idx_returns_order", columnList = "order_id"),
                @Index(name = "idx_returns_status", columnList = "status")
        }
)
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String requestNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReturnType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReturnReason reason;

    @Column(length = 1000)
    private String details;

    @Column(length = 500)
    private String imageEvidenceUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exchange_product_id")
    private Product exchangeProduct;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReturnStatus status = ReturnStatus.PENDING;

    @Column(precision = 10, scale = 2)
    private BigDecimal refundAmount = BigDecimal.ZERO;

    @Column(length = 1000)
    private String staffReviewNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedBy;

    @Column(nullable = false)
    private boolean restockItem = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    public ReturnRequest() {
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRequestNumber() {
        return requestNumber;
    }

    public void setRequestNumber(String requestNumber) {
        this.requestNumber = requestNumber;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ReturnType getType() {
        return type;
    }

    public void setType(ReturnType type) {
        this.type = type;
    }

    public ReturnReason getReason() {
        return reason;
    }

    public void setReason(ReturnReason reason) {
        this.reason = reason;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getImageEvidenceUrl() {
        return imageEvidenceUrl;
    }

    public void setImageEvidenceUrl(String imageEvidenceUrl) {
        this.imageEvidenceUrl = imageEvidenceUrl;
    }

    public Product getExchangeProduct() {
        return exchangeProduct;
    }

    public void setExchangeProduct(Product exchangeProduct) {
        this.exchangeProduct = exchangeProduct;
    }

    public ReturnStatus getStatus() {
        return status;
    }

    public void setStatus(ReturnStatus status) {
        this.status = status;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public String getStaffReviewNotes() {
        return staffReviewNotes;
    }

    public void setStaffReviewNotes(String staffReviewNotes) {
        this.staffReviewNotes = staffReviewNotes;
    }

    public User getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public boolean isRestockItem() {
        return restockItem;
    }

    public void setRestockItem(boolean restockItem) {
        this.restockItem = restockItem;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
