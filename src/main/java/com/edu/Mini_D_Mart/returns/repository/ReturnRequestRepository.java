package com.edu.Mini_D_Mart.returns.repository;

import com.edu.Mini_D_Mart.returns.entity.ReturnRequest;
import com.edu.Mini_D_Mart.returns.entity.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {

    List<ReturnRequest> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<ReturnRequest> findAllByOrderByCreatedAtDesc();

    List<ReturnRequest> findAllByStatusOrderByCreatedAtAsc(ReturnStatus status);

    Optional<ReturnRequest> findByRequestNumber(String requestNumber);

    boolean existsByOrderItemIdAndStatusNotIn(Long orderItemId, List<ReturnStatus> excludedStatuses);

    long countByStatus(ReturnStatus status);
}
