package com.edu.Mini_D_Mart.category.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(
        name = "categories",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_categories_name",
                        columnNames = "name"
                )
        },
        indexes = {
                @Index(
                        name = "idx_categories_name",
                        columnList = "name"
                ),
                @Index(
                        name = "idx_categories_active",
                        columnList = "active"
                )
        }
)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 100
    )
    private String name;

    @Column(
            length = 500
    )
    private String description;

    @Column(
            length = 500
    )
    private String imageUrl;

    @Column(
            nullable = false
    )
    private boolean active = true;

    @Column(
            nullable = false,
            updatable = false
    )
    private Instant createdAt;

    @Column(
            nullable = false
    )
    private Instant updatedAt;

    public Category() {
    }

    @PrePersist
    protected void onCreate() {

        Instant now = Instant.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}