package com.edu.Mini_D_Mart.audit.repository;

import com.edu.Mini_D_Mart.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findAllByActionOrderByTimestampDesc(String action);

    List<AuditLog> findTop100ByOrderByTimestampDesc();
}
