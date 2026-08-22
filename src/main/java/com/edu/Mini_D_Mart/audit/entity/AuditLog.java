package com.edu.Mini_D_Mart.audit.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(
        name = "audit_logs",
        indexes = {
                @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
                @Index(name = "idx_audit_user", columnList = "userId"),
                @Index(name = "idx_audit_action", columnList = "action")
        }
)
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(nullable = false, length = 100)
    private String entityName;

    @Column(length = 100)
    private String entityId;

    private Long userId;

    @Column(length = 150)
    private String userEmail;

    @Column(length = 50)
    private String role;

    @Column(length = 100)
    private String ipAddress;

    @Column(length = 1000)
    private String details;

    @Column(nullable = false)
    private Instant timestamp;

    public AuditLog() {
    }

    public AuditLog(String action, String entityName, String entityId, Long userId, String userEmail, String role, String ipAddress, String details) {
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.role = role;
        this.ipAddress = ipAddress;
        this.details = details;
        this.timestamp = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
