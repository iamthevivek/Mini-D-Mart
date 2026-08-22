package com.edu.Mini_D_Mart;

import com.edu.Mini_D_Mart.cart.dto.AddToCartRequest;
import com.edu.Mini_D_Mart.cart.service.CartService;
import com.edu.Mini_D_Mart.order.dto.CancelOrderRequest;
import com.edu.Mini_D_Mart.order.dto.OrderResponse;
import com.edu.Mini_D_Mart.order.dto.PlaceOrderRequest;
import com.edu.Mini_D_Mart.order.dto.VerifyPickupRequest;
import com.edu.Mini_D_Mart.order.entity.FulfillmentType;
import com.edu.Mini_D_Mart.order.entity.OrderStatus;
import com.edu.Mini_D_Mart.order.entity.PaymentMethod;
import com.edu.Mini_D_Mart.order.entity.PickupSlot;
import com.edu.Mini_D_Mart.order.repository.PickupSlotRepository;
import com.edu.Mini_D_Mart.order.service.OrderService;
import com.edu.Mini_D_Mart.product.entity.Product;
import com.edu.Mini_D_Mart.product.repository.ProductRepository;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class OrderServiceTests {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PickupSlotRepository pickupSlotRepository;

    @Test
    @DisplayName("Should successfully place home delivery order, deduct stock, and calculate delivery fee")
    void testPlaceHomeDeliveryOrder() {
        User customer = userRepository.findByEmailIgnoreCase("customer@minidmart.com").orElseThrow();
        Product product = productRepository.findAllByActiveTrueOrderByCreatedAtDesc().get(0);
        int initialStock = product.getStockQuantity();

        cartService.clearCart(customer.getId());
        cartService.addToCart(customer.getId(), new AddToCartRequest(product.getId(), 2));

        PlaceOrderRequest request = new PlaceOrderRequest(
                FulfillmentType.HOME_DELIVERY,
                PaymentMethod.UPI,
                "123 Green Park",
                "New Delhi",
                "110016",
                "+91 9876543210",
                "Leave at door",
                null
        );

        OrderResponse orderResponse = orderService.placeOrder(customer.getId(), request);

        assertNotNull(orderResponse);
        assertNotNull(orderResponse.orderNumber());
        assertEquals(OrderStatus.PLACED, orderResponse.status());
        assertEquals(FulfillmentType.HOME_DELIVERY, orderResponse.fulfillmentType());
        assertEquals(2, orderResponse.totalItems());

        // Verify stock deducted
        Product updatedProduct = productRepository.findById(product.getId()).orElseThrow();
        assertEquals(initialStock - 2, updatedProduct.getStockQuantity());
    }

    @Test
    @DisplayName("Should place store pickup order with slot reservation and verification code")
    void testPlaceStorePickupOrder() {
        User customer = userRepository.findByEmailIgnoreCase("customer@minidmart.com").orElseThrow();
        Product product = productRepository.findAllByActiveTrueOrderByCreatedAtDesc().get(0);
        List<PickupSlot> slots = pickupSlotRepository.findAll();
        assertFalse(slots.isEmpty());
        PickupSlot slot = slots.get(0);
        int initialBooked = slot.getBookedCount();

        cartService.clearCart(customer.getId());
        cartService.addToCart(customer.getId(), new AddToCartRequest(product.getId(), 1));

        PlaceOrderRequest request = new PlaceOrderRequest(
                FulfillmentType.STORE_PICKUP,
                PaymentMethod.CARD,
                null, null, null, null, null,
                slot.getId()
        );

        OrderResponse orderResponse = orderService.placeOrder(customer.getId(), request);

        assertNotNull(orderResponse);
        assertEquals(FulfillmentType.STORE_PICKUP, orderResponse.fulfillmentType());
        assertNotNull(orderResponse.pickupVerificationCode());
        assertEquals(6, orderResponse.pickupVerificationCode().length());

        // Verify slot booked count incremented
        PickupSlot updatedSlot = pickupSlotRepository.findById(slot.getId()).orElseThrow();
        assertEquals(initialBooked + 1, updatedSlot.getBookedCount());
    }

    @Test
    @DisplayName("Should cancel order, refund payment, and automatically restock inventory")
    void testCancelOrderAndRestock() {
        User customer = userRepository.findByEmailIgnoreCase("customer@minidmart.com").orElseThrow();
        Product product = productRepository.findAllByActiveTrueOrderByCreatedAtDesc().get(0);
        int initialStock = product.getStockQuantity();

        cartService.clearCart(customer.getId());
        cartService.addToCart(customer.getId(), new AddToCartRequest(product.getId(), 2));

        PlaceOrderRequest request = new PlaceOrderRequest(
                FulfillmentType.HOME_DELIVERY,
                PaymentMethod.UPI,
                "456 High St", "Bangalore", "560001", "+91 9988776655", "", null
        );

        OrderResponse placed = orderService.placeOrder(customer.getId(), request);

        // Cancel order
        CancelOrderRequest cancelRequest = new CancelOrderRequest("Ordered by mistake");
        OrderResponse cancelled = orderService.cancelOrder(customer.getId(), placed.id(), cancelRequest);

        assertEquals(OrderStatus.CANCELLED, cancelled.status());
        assertEquals("Ordered by mistake", cancelled.cancellationReason());

        // Check product was restocked
        Product restocked = productRepository.findById(product.getId()).orElseThrow();
        assertEquals(initialStock, restocked.getStockQuantity());
    }
}
