package com.example.stud_erp.repository;

import com.example.stud_erp.entity.EventReaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventReactionRepository extends JpaRepository<EventReaction, Long> {

    List<EventReaction> findByEventId(Long eventId);

    Optional<EventReaction> findByEventIdAndStudentId(Long eventId, Long studentId);
}