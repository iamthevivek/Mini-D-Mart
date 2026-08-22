package com.edu.Mini_D_Mart.audit.service;

import com.edu.Mini_D_Mart.audit.entity.AuditLog;
import com.edu.Mini_D_Mart.audit.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(String action, String entityName, String entityId, Long userId, String userEmail, String role, String ipAddress, String details) {
        AuditLog auditLog = new AuditLog(action, entityName, entityId, userId, userEmail, role, ipAddress, details);
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop100ByOrderByTimestampDesc();
    }
}
