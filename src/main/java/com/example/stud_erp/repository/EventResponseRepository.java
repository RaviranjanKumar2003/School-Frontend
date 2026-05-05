package com.example.stud_erp.repository;

import com.example.stud_erp.entity.EventResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface EventResponseRepository extends JpaRepository<EventResponse, Long> {

    // 🔥 FIX: ye method missing tha
    Optional<EventResponse> findByEventIdAndTeacherId(Long eventId, Long teacherId);

    // 🔥 admin ke liye responses dekhne ke liye
    List<EventResponse> findByEventId(Long eventId);
}