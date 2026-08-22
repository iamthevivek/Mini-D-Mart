package com.edu.Mini_D_Mart.category.service;

import com.edu.Mini_D_Mart.category.dto.CategoryRequest;
import com.edu.Mini_D_Mart.category.dto.CategoryResponse;
import com.edu.Mini_D_Mart.category.entity.Category;
import com.edu.Mini_D_Mart.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(
            CategoryRepository categoryRepository
    ) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getActiveCategories() {

        return categoryRepository
                .findAllByActiveTrueOrderByNameAsc()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository
                .findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Category not found"
                        )
                );

        return CategoryResponse.from(category);
    }

    @Transactional
    public CategoryResponse createCategory(
            CategoryRequest request
    ) {

        String name = normalizeName(request.name());

        if (categoryRepository.existsByNameIgnoreCase(name)) {

            throw new IllegalArgumentException(
                    "A category with this name already exists"
            );
        }

        Category category = new Category();

        category.setName(name);
        category.setDescription(
                normalizeDescription(request.description())
        );
        category.setImageUrl(
                normalizeDescription(request.imageUrl())
        );
        category.setActive(true);

        Category savedCategory =
                categoryRepository.save(category);

        return CategoryResponse.from(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(
            Long id,
            CategoryRequest request
    ) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Category not found"
                        )
                );

        String newName = normalizeName(request.name());

        boolean nameChanged =
                !category.getName()
                        .equalsIgnoreCase(newName);

        if (nameChanged &&
                categoryRepository.existsByNameIgnoreCase(newName)) {

            throw new IllegalArgumentException(
                    "A category with this name already exists"
            );
        }

        category.setName(newName);

        category.setDescription(
                normalizeDescription(request.description())
        );
        if (request.imageUrl() != null) {
            category.setImageUrl(normalizeDescription(request.imageUrl()));
        }

        Category updatedCategory =
                categoryRepository.save(category);

        return CategoryResponse.from(updatedCategory);
    }

    @Transactional
    public CategoryResponse toggleCategoryStatus(Long id) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Category not found"
                        )
                );

        category.setActive(!category.isActive());

        return CategoryResponse.from(
                categoryRepository.save(category)
        );
    }

    @Transactional
    public CategoryResponse deactivateCategory(Long id) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Category not found"
                        )
                );

        if (!category.isActive()) {

            throw new IllegalArgumentException(
                    "Category is already inactive"
            );
        }

        category.setActive(false);

        return CategoryResponse.from(
                categoryRepository.save(category)
        );
    }

    private String normalizeName(String name) {

        return name.trim();
    }

    private String normalizeDescription(
            String description
    ) {

        if (description == null) {
            return null;
        }

        String normalized = description.trim();

        return normalized.isBlank()
                ? null
                : normalized;
    }
}