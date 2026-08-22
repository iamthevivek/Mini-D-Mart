package com.edu.Mini_D_Mart.order.service;

import com.edu.Mini_D_Mart.cart.entity.CartItem;
import com.edu.Mini_D_Mart.cart.repository.CartItemRepository;
import com.edu.Mini_D_Mart.exception.ResourceNotFoundException;
import com.edu.Mini_D_Mart.order.dto.*;
import com.edu.Mini_D_Mart.order.entity.*;
import com.edu.Mini_D_Mart.order.repository.OrderItemRepository;
import com.edu.Mini_D_Mart.order.repository.OrderRepository;
import com.edu.Mini_D_Mart.order.repository.PickupSlotRepository;
import com.edu.Mini_D_Mart.product.entity.Product;
import com.edu.Mini_D_Mart.product.repository.ProductRepository;
import com.edu.Mini_D_Mart.user.entity.Role;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    private static final BigDecimal FREE_DELIVERY_THRESHOLD = BigDecimal.valueOf(500.00);
    private static final BigDecimal STANDARD_DELIVERY_FEE = BigDecimal.valueOf(40.00);
    private static final BigDecimal TAX_RATE = BigDecimal.valueOf(0.05);

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final PickupSlotRepository pickupSlotRepository;
    private final UserRepository userRepository;

    private final Random random = new SecureRandom();

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            PickupSlotRepository pickupSlotRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.pickupSlotRepository = pickupSlotRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Your cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (!product.isActive()) {
                throw new IllegalStateException("Product '" + product.getName() + "' is no longer available");
            }
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalStateException("Product '" + product.getName() + "' has only " + product.getStockQuantity() + " units in stock (you requested " + cartItem.getQuantity() + ")");
            }
            BigDecimal itemSubtotal = product.getSellingPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);
        }

        PickupSlot pickupSlot = null;
        String verificationCode = null;
        BigDecimal deliveryFee = BigDecimal.ZERO;

        if (request.fulfillmentType() == FulfillmentType.STORE_PICKUP) {
            if (request.pickupSlotId() == null) {
                throw new IllegalArgumentException("A pickup slot must be selected for Store Pickup");
            }
            pickupSlot = pickupSlotRepository.findById(request.pickupSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Selected pickup slot not found"));

            if (!pickupSlot.hasAvailableCapacity()) {
                throw new IllegalStateException("Selected pickup slot is fully booked. Please choose another slot.");
            }

            pickupSlot.setBookedCount(pickupSlot.getBookedCount() + 1);
            pickupSlotRepository.save(pickupSlot);

            verificationCode = String.format("%06d", random.nextInt(1_000_000));
            deliveryFee = BigDecimal.ZERO;
        } else {
            if (request.deliveryAddress() == null || request.deliveryAddress().trim().isBlank() ||
                    request.deliveryCity() == null || request.deliveryCity().trim().isBlank() ||
                    request.deliveryPincode() == null || request.deliveryPincode().trim().isBlank() ||
                    request.deliveryPhone() == null || request.deliveryPhone().trim().isBlank()) {
                throw new IllegalArgumentException("Full address, city, pincode, and contact phone are required for Home Delivery");
            }

            if (subtotal.compareTo(FREE_DELIVERY_THRESHOLD) < 0) {
                deliveryFee = STANDARD_DELIVERY_FEE;
            }
        }

        BigDecimal taxAmount = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(deliveryFee).add(taxAmount).subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);

        PaymentStatus paymentStatus = (request.paymentMethod() == PaymentMethod.CASH_ON_DELIVERY)
                ? PaymentStatus.PENDING
                : PaymentStatus.PAID;

        String orderNumber = "DM-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + String.format("%04d", random.nextInt(10000));

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setFulfillmentType(request.fulfillmentType());
        order.setStatus(OrderStatus.PLACED);
        order.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        order.setDeliveryFee(deliveryFee);
        order.setDiscountAmount(discountAmount);
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus(paymentStatus);
        order.setDeliveryAddress(request.deliveryAddress());
        order.setDeliveryCity(request.deliveryCity());
        order.setDeliveryPincode(request.deliveryPincode());
        order.setDeliveryPhone(request.deliveryPhone());
        order.setDeliveryInstructions(request.deliveryInstructions());
        order.setPickupSlot(pickupSlot);
        order.setPickupVerificationCode(verificationCode);
        order.setPlacedAt(Instant.now());

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setProductSku(product.getSku());
            orderItem.setProductImageUrl(product.getImageUrl());
            orderItem.setUnit(product.getUnit());
            orderItem.setUnitPrice(product.getSellingPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSubtotal(product.getSellingPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())).setScale(2, RoundingMode.HALF_UP));
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteAllByUserId(userId);

        return OrderResponse.from(savedOrder);
    }

    @Transactional
    public OrderResponse cancelOrder(Long userId, Long orderId, CancelOrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to cancel this order");
        }

        if (order.getStatus() != OrderStatus.PLACED && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Order cannot be cancelled in status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(request.cancellationReason());
        order.setCancelledAt(Instant.now());

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        if (order.getPickupSlot() != null && order.getPickupSlot().getBookedCount() > 0) {
            PickupSlot slot = order.getPickupSlot();
            slot.setBookedCount(slot.getBookedCount() - 1);
            pickupSlotRepository.save(slot);
        }

        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse staffCancelOrder(Long orderId, CancelOrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order is already cancelled");
        }
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.PICKED_UP) {
            throw new IllegalStateException("Completed orders cannot be cancelled. Initiate return/exchange instead.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(request.cancellationReason() != null ? request.cancellationReason() : "Cancelled by store operations staff");
        order.setCancelledAt(Instant.now());

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        if (order.getPickupSlot() != null && order.getPickupSlot().getBookedCount() > 0) {
            PickupSlot slot = order.getPickupSlot();
            slot.setBookedCount(slot.getBookedCount() - 1);
            pickupSlotRepository.save(slot);
        }

        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus newStatus = request.status();
        OrderStatus oldStatus = order.getStatus();

        if (oldStatus == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot change status of a cancelled order");
        }

        order.setStatus(newStatus);
        if (request.staffNotes() != null) {
            order.setStaffNotes(request.staffNotes());
        }

        if (newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.PICKED_UP) {
            order.setCompletedAt(Instant.now());
            if (order.getPaymentStatus() == PaymentStatus.PENDING) {
                order.setPaymentStatus(PaymentStatus.PAID);
            }
        } else if (newStatus == OrderStatus.CANCELLED) {
            order.setCancelledAt(Instant.now());
            if (order.getPaymentStatus() == PaymentStatus.PAID) {
                order.setPaymentStatus(PaymentStatus.REFUNDED);
            }

            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null) {
                    Product product = item.getProduct();
                    product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                    productRepository.save(product);
                }
            }
            if (order.getPickupSlot() != null && order.getPickupSlot().getBookedCount() > 0) {
                PickupSlot slot = order.getPickupSlot();
                slot.setBookedCount(slot.getBookedCount() - 1);
                pickupSlotRepository.save(slot);
            }
        }

        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse verifyAndCompletePickup(VerifyPickupRequest request) {
        String code = request.verificationCode().trim();
        List<Order> matching = orderRepository.findAll().stream()
                .filter(o -> o.getFulfillmentType() == FulfillmentType.STORE_PICKUP
                        && code.equals(o.getPickupVerificationCode())
                        && o.getStatus() != OrderStatus.CANCELLED
                        && o.getStatus() != OrderStatus.PICKED_UP)
                .toList();

        if (matching.isEmpty()) {
            throw new ResourceNotFoundException("No active pickup order found matching verification code: " + code);
        }

        Order order = matching.get(0);
        order.setStatus(OrderStatus.PICKED_UP);
        order.setCompletedAt(Instant.now());
        if (order.getPaymentStatus() == PaymentStatus.PENDING) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrders(Long userId) {
        return orderRepository.findAllByUserIdOrderByPlacedAtDesc(userId).stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderDetails(Long orderId, Long userId, Role role) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (role == Role.CUSTOMER && !order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to view this order");
        }

        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByPlacedAtDesc().stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getStaffPreparationQueue() {
        List<OrderStatus> activeStatuses = List.of(
                OrderStatus.PLACED,
                OrderStatus.CONFIRMED,
                OrderStatus.PREPARING,
                OrderStatus.READY_FOR_PICKUP,
                OrderStatus.OUT_FOR_DELIVERY
        );
        return orderRepository.findAllByStatusInOrderByPlacedAtAsc(activeStatuses).stream()
                .map(OrderResponse::from)
                .toList();
    }
}
