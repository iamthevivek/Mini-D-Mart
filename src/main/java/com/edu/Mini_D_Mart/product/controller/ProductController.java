package com.edu.Mini_D_Mart.product.controller;

import com.edu.Mini_D_Mart.product.dto.ProductRequest;
import com.edu.Mini_D_Mart.product.dto.ProductResponse;
import com.edu.Mini_D_Mart.product.dto.StockAdjustmentRequest;
import com.edu.Mini_D_Mart.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "false") boolean inStockOnly
    ) {
        return ResponseEntity.ok(productService.searchProducts(categoryId, query, minPrice, maxPrice, inStockOnly));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductResponse> adjustStock(
            @PathVariable Long id,
            @Valid @RequestBody StockAdjustmentRequest request
    ) {
        return ResponseEntity.ok(productService.adjustStock(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ProductResponse> toggleProductStatus(@PathVariable Long id) {
        return ResponseEntity.ok(productService.toggleProductStatus(id));
    }
}
