package com.edu.Mini_D_Mart.order.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
        name = "pickup_slots",
        indexes = {
                @Index(name = "idx_slot_date", columnList = "slotDate"),
                @Index(name = "idx_slot_active", columnList = "active")
        }
)
public class PickupSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer maxCapacity = 20;

    @Column(nullable = false)
    private Integer bookedCount = 0;

    @Column(nullable = false)
    private boolean active = true;

    public PickupSlot() {
    }

    public PickupSlot(LocalDate slotDate, LocalTime startTime, LocalTime endTime, Integer maxCapacity) {
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxCapacity = maxCapacity;
        this.bookedCount = 0;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public Integer getBookedCount() {
        return bookedCount;
    }

    public void setBookedCount(Integer bookedCount) {
        this.bookedCount = bookedCount;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getRemainingCapacity() {
        return Math.max(0, maxCapacity - bookedCount);
    }

    public boolean hasAvailableCapacity() {
        return active && bookedCount < maxCapacity;
    }
}
