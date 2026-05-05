package com.example.stud_erp.repository;

import com.example.stud_erp.entity.StudentExam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentExamRepository extends JpaRepository<StudentExam, Long> {

    List<StudentExam> findByExamScheduleId(Long examScheduleId);
    List<StudentExam> findByStudentId(Long studentId);
    StudentExam findByStudentIdAndExamScheduleId(Long studentId, Long examScheduleId);
    StudentExam findTopByStudentIdOrderByIdDesc(Long studentId);
    StudentExam findTopByStudentIdOrderByExamScheduleIdDesc(Long studentId);

}