package com.edu.Mini_D_Mart.product.repository;

import com.edu.Mini_D_Mart.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findAllByActiveTrueOrderByCreatedAtDesc();

    List<Product> findAllByActiveTrueAndCategoryIdOrderByCreatedAtDesc(Long categoryId);

    Optional<Product> findByIdAndActiveTrue(Long id);

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsByBarcodeIgnoreCase(String barcode);

    Optional<Product> findBySkuIgnoreCase(String sku);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.stockQuantity <= p.lowStockThreshold")
    List<Product> findLowStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true AND p.stockQuantity <= p.lowStockThreshold")
    long countLowStockProducts();
}
