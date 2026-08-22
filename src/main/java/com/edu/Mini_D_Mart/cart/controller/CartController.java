package com.edu.Mini_D_Mart.cart.controller;

import com.edu.Mini_D_Mart.cart.dto.AddToCartRequest;
import com.edu.Mini_D_Mart.cart.dto.CartSummaryResponse;
import com.edu.Mini_D_Mart.cart.dto.UpdateCartItemRequest;
import com.edu.Mini_D_Mart.cart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private Long getUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<CartSummaryResponse> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCartSummary(getUserId(authentication)));
    }

    @PostMapping
    public ResponseEntity<CartSummaryResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cartService.addToCart(getUserId(authentication), request));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartSummaryResponse> updateQuantity(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(getUserId(authentication), cartItemId, request.quantity()));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<CartSummaryResponse> removeFromCart(
            Authentication authentication,
            @PathVariable Long cartItemId
    ) {
        return ResponseEntity.ok(cartService.removeFromCart(getUserId(authentication), cartItemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(getUserId(authentication));
        return ResponseEntity.noContent().build();
    }
}
