package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByStudentId(Long studentId);

    List<Leave> findBySendTo(String sendTo); // HOD / TEACHER ke liye
}