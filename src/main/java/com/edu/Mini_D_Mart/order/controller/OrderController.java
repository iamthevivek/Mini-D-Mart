package com.edu.Mini_D_Mart.order.controller;

import com.edu.Mini_D_Mart.order.dto.*;
import com.edu.Mini_D_Mart.order.service.OrderService;
import com.edu.Mini_D_Mart.user.entity.Role;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    private Role getUserRole(Authentication authentication) {
        User user = userRepository.findById(getUserId(authentication)).orElse(null);
        return user != null ? user.getRole() : Role.CUSTOMER;
    }

    @PostMapping("/customer")
    public ResponseEntity<OrderResponse> placeOrder(
            Authentication authentication,
            @Valid @RequestBody PlaceOrderRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(getUserId(authentication), request));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<OrderResponse>> getCustomerOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getCustomerOrders(getUserId(authentication)));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<OrderResponse> getCustomerOrderDetails(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(orderService.getOrderDetails(id, getUserId(authentication), Role.CUSTOMER));
    }

    @PostMapping("/customer/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request
    ) {
        return ResponseEntity.ok(orderService.cancelOrder(getUserId(authentication), id, request));
    }

    @GetMapping("/staff/queue")
    public ResponseEntity<List<OrderResponse>> getStaffQueue() {
        return ResponseEntity.ok(orderService.getStaffPreparationQueue());
    }

    @PatchMapping("/staff/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    @PostMapping("/staff/{id}/cancel")
    public ResponseEntity<OrderResponse> staffCancelOrder(
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request
    ) {
        return ResponseEntity.ok(orderService.staffCancelOrder(id, request));
    }

    @PostMapping("/staff/verify-pickup")
    public ResponseEntity<OrderResponse> verifyPickup(
            @Valid @RequestBody VerifyPickupRequest request
    ) {
        return ResponseEntity.ok(orderService.verifyAndCompletePickup(request));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<OrderResponse> getAdminOrderDetails(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(orderService.getOrderDetails(id, getUserId(authentication), getUserRole(authentication)));
    }
}
