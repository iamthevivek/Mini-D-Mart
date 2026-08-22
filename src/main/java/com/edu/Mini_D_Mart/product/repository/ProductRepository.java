package com.edu.Mini_D_Mart.product.repository;

import com.edu.Mini_D_Mart.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByActiveTrueOrderByCreatedAtDesc();

    List<Product> findAllByActiveTrueAndCategoryIdOrderByCreatedAtDesc(Long categoryId);

    Optional<Product> findByIdAndActiveTrue(Long id);

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsByBarcodeIgnoreCase(String barcode);

    Optional<Product> findBySkuIgnoreCase(String sku);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:minPrice IS NULL OR p.sellingPrice >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.sellingPrice <= :maxPrice) AND " +
            "(:inStockOnly = false OR p.stockQuantity > 0) " +
            "ORDER BY p.id ASC")
    List<Product> searchProducts(
            @Param("categoryId") Long categoryId,
            @Param("query") String query,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("inStockOnly") boolean inStockOnly
    );

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.stockQuantity <= p.lowStockThreshold")
    List<Product> findLowStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true AND p.stockQuantity <= p.lowStockThreshold")
    long countLowStockProducts();
}
