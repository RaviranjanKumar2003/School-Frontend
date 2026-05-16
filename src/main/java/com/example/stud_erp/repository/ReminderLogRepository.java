package com.example.stud_erp.repository;

import com.example.stud_erp.entity.ReminderLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReminderLogRepository extends JpaRepository<ReminderLog, Long> {

    List<ReminderLog> findByStudentId(String studentId);

    ReminderLog findTopByStudentIdOrderBySentAtDesc(String studentId);

}