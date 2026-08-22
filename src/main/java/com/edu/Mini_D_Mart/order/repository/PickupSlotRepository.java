package com.edu.Mini_D_Mart.order.repository;

import com.edu.Mini_D_Mart.order.entity.PickupSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PickupSlotRepository extends JpaRepository<PickupSlot, Long> {

    List<PickupSlot> findAllByActiveTrueAndSlotDateGreaterThanEqualOrderBySlotDateAscStartTimeAsc(LocalDate date);

    List<PickupSlot> findAllByActiveTrueAndSlotDateInOrderBySlotDateAscStartTimeAsc(List<LocalDate> dates);

    Optional<PickupSlot> findBySlotDateAndStartTime(LocalDate slotDate, LocalTime startTime);

    List<PickupSlot> findAllByOrderBySlotDateDescStartTimeAsc();
}
