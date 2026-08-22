package com.edu.Mini_D_Mart;

import com.edu.Mini_D_Mart.product.dto.ProductResponse;
import com.edu.Mini_D_Mart.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductServiceTests {

    @Autowired
    private ProductService productService;

    @Test
    void testSearchProductsDefault() {
        List<ProductResponse> products = productService.searchProducts(null, null, null, null, false);
        assertNotNull(products);
        System.out.println("Found products count: " + products.size());
        assertFalse(products.isEmpty());
    }

    @Test
    void testSearchProductsByQuery() {
        List<ProductResponse> products = productService.searchProducts(null, "milk", null, null, false);
        assertNotNull(products);
        assertTrue(products.stream().allMatch(p -> p.name().toLowerCase().contains("milk") || (p.description() != null && p.description().toLowerCase().contains("milk"))));
    }

    @Test
    void testSearchProductsByCategory() {
        List<ProductResponse> products = productService.searchProducts(1L, null, null, null, false);
        assertNotNull(products);
        assertTrue(products.stream().allMatch(p -> p.category() != null && p.category().id().equals(1L)));
    }

    @Test
    void testSearchProductsInStockOnly() {
        List<ProductResponse> products = productService.searchProducts(null, null, null, null, true);
        assertNotNull(products);
        assertTrue(products.stream().allMatch(p -> p.stockQuantity() > 0));
    }
}
