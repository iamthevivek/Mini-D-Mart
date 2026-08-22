package com.edu.Mini_D_Mart.cart.service;

import com.edu.Mini_D_Mart.cart.dto.AddToCartRequest;
import com.edu.Mini_D_Mart.cart.dto.CartItemResponse;
import com.edu.Mini_D_Mart.cart.dto.CartSummaryResponse;
import com.edu.Mini_D_Mart.cart.entity.CartItem;
import com.edu.Mini_D_Mart.cart.repository.CartItemRepository;
import com.edu.Mini_D_Mart.exception.ResourceNotFoundException;
import com.edu.Mini_D_Mart.product.entity.Product;
import com.edu.Mini_D_Mart.product.repository.ProductRepository;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private static final BigDecimal FREE_DELIVERY_THRESHOLD = BigDecimal.valueOf(500.00);
    private static final BigDecimal STANDARD_DELIVERY_FEE = BigDecimal.valueOf(40.00);
    private static final BigDecimal TAX_RATE = BigDecimal.valueOf(0.05);

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public CartSummaryResponse getCartSummary(Long userId) {
        List<CartItem> items = cartItemRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        List<CartItemResponse> itemResponses = items.stream()
                .map(CartItemResponse::from)
                .toList();

        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();

        BigDecimal subtotal = BigDecimal.ZERO;
        boolean hasUnavailable = false;

        for (CartItemResponse item : itemResponses) {
            subtotal = subtotal.add(item.subtotal());
            if (!item.isAvailable()) {
                hasUnavailable = true;
            }
        }

        boolean eligibleForFree = subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0;
        BigDecimal deliveryFee = (items.isEmpty() || eligibleForFree) ? BigDecimal.ZERO : STANDARD_DELIVERY_FEE;
        BigDecimal amountNeeded = eligibleForFree ? BigDecimal.ZERO : FREE_DELIVERY_THRESHOLD.subtract(subtotal);

        BigDecimal estimatedTax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(deliveryFee).add(estimatedTax).setScale(2, RoundingMode.HALF_UP);

        return new CartSummaryResponse(
                itemResponses,
                totalItems,
                subtotal.setScale(2, RoundingMode.HALF_UP),
                deliveryFee,
                FREE_DELIVERY_THRESHOLD,
                eligibleForFree,
                amountNeeded.compareTo(BigDecimal.ZERO) > 0 ? amountNeeded.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO,
                estimatedTax,
                totalAmount,
                hasUnavailable
        );
    }

    @Transactional
    public CartSummaryResponse addToCart(Long userId, AddToCartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.isActive()) {
            throw new IllegalArgumentException("Product is currently unavailable");
        }

        if (product.getStockQuantity() < request.quantity()) {
            throw new IllegalArgumentException("Requested quantity exceeds available stock (" + product.getStockQuantity() + ")");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserIdAndProductId(userId, product.getId());

        if (existingItemOpt.isPresent()) {
            CartItem existing = existingItemOpt.get();
            int newQuantity = existing.getQuantity() + request.quantity();
            if (newQuantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Cannot add more. Total in cart (" + newQuantity + ") exceeds stock (" + product.getStockQuantity() + ")");
            }
            existing.setQuantity(newQuantity);
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(request.quantity());
            cartItemRepository.save(newItem);
        }

        return getCartSummary(userId);
    }

    @Transactional
    public CartSummaryResponse updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            return removeFromCart(userId, cartItemId);
        }

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized cart item modification");
        }

        if (quantity > item.getProduct().getStockQuantity()) {
            throw new IllegalArgumentException("Quantity exceeds available stock (" + item.getProduct().getStockQuantity() + ")");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return getCartSummary(userId);
    }

    @Transactional
    public CartSummaryResponse removeFromCart(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized cart item removal");
        }

        cartItemRepository.delete(item);
        return getCartSummary(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteAllByUserId(userId);
    }
}
