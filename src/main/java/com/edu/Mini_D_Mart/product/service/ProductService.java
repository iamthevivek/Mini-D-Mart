package com.edu.Mini_D_Mart.product.service;

import com.edu.Mini_D_Mart.category.entity.Category;
import com.edu.Mini_D_Mart.category.repository.CategoryRepository;
import com.edu.Mini_D_Mart.exception.ResourceNotFoundException;
import com.edu.Mini_D_Mart.product.dto.ProductRequest;
import com.edu.Mini_D_Mart.product.dto.ProductResponse;
import com.edu.Mini_D_Mart.product.dto.StockAdjustmentRequest;
import com.edu.Mini_D_Mart.product.entity.Product;
import com.edu.Mini_D_Mart.product.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getActiveProducts() {
        return productRepository.findAllByActiveTrueOrderByCreatedAtDesc().stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductResponse.from(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(
            Long categoryId,
            String query,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            boolean inStockOnly
    ) {
        Specification<Product> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (query != null && !query.trim().isBlank()) {
                String searchPattern = "%" + query.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), searchPattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(nameMatch, descMatch));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }

            if (inStockOnly) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        String sku = request.sku().trim().toUpperCase();
        if (productRepository.existsBySkuIgnoreCase(sku)) {
            throw new IllegalArgumentException("A product with SKU '" + sku + "' already exists");
        }

        if (request.barcode() != null && !request.barcode().trim().isBlank()) {
            String barcode = request.barcode().trim();
            if (productRepository.existsByBarcodeIgnoreCase(barcode)) {
                throw new IllegalArgumentException("A product with barcode '" + barcode + "' already exists");
            }
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));

        Product product = new Product();
        product.setName(request.name().trim());
        product.setDescription(request.description() != null ? request.description().trim() : null);
        product.setCategory(category);
        product.setSku(sku);
        product.setBarcode(request.barcode() != null && !request.barcode().trim().isBlank() ? request.barcode().trim() : null);
        product.setImageUrl(request.imageUrl() != null ? request.imageUrl().trim() : null);
        product.setUnit(request.unit().trim());
        product.setMrpPrice(request.mrpPrice());
        product.setSellingPrice(request.sellingPrice());
        product.setStockQuantity(request.stockQuantity());
        product.setLowStockThreshold(request.lowStockThreshold() != null ? request.lowStockThreshold() : 10);
        product.setReturnable(request.isReturnable() != null ? request.isReturnable() : true);
        product.setReturnWindowDays(request.returnWindowDays() != null ? request.returnWindowDays() : 7);
        product.setActive(true);

        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        String newSku = request.sku().trim().toUpperCase();
        if (!product.getSku().equalsIgnoreCase(newSku) && productRepository.existsBySkuIgnoreCase(newSku)) {
            throw new IllegalArgumentException("A product with SKU '" + newSku + "' already exists");
        }

        if (request.barcode() != null && !request.barcode().trim().isBlank()) {
            String newBarcode = request.barcode().trim();
            if ((product.getBarcode() == null || !product.getBarcode().equalsIgnoreCase(newBarcode))
                    && productRepository.existsByBarcodeIgnoreCase(newBarcode)) {
                throw new IllegalArgumentException("A product with barcode '" + newBarcode + "' already exists");
            }
            product.setBarcode(newBarcode);
        } else {
            product.setBarcode(null);
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));

        product.setName(request.name().trim());
        product.setDescription(request.description() != null ? request.description().trim() : null);
        product.setCategory(category);
        product.setSku(newSku);
        product.setImageUrl(request.imageUrl() != null ? request.imageUrl().trim() : null);
        product.setUnit(request.unit().trim());
        product.setMrpPrice(request.mrpPrice());
        product.setSellingPrice(request.sellingPrice());
        product.setStockQuantity(request.stockQuantity());
        if (request.lowStockThreshold() != null) {
            product.setLowStockThreshold(request.lowStockThreshold());
        }
        if (request.isReturnable() != null) {
            product.setReturnable(request.isReturnable());
        }
        if (request.returnWindowDays() != null) {
            product.setReturnWindowDays(request.returnWindowDays());
        }

        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse adjustStock(Long id, StockAdjustmentRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setStockQuantity(request.stockQuantity());
        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setActive(!product.isActive());
        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }
}
