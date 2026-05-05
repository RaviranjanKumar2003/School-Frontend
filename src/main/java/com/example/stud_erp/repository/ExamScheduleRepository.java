package com.example.stud_erp.repository;

import com.example.stud_erp.entity.ExamSchedule;
import com.example.stud_erp.enums.ExamType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {

    boolean existsByClassIdAndExamDateAndShift(
            Long classId,
            String examDate,
            String shift
    );

    List<ExamSchedule> findByTeacherId(Long teacherId);
    List<ExamSchedule> findAll();
    ExamSchedule findTopByClassIdAndTeacherIdOrderByIdDesc(
            Long classId,
            Long teacherId
    );

    List<ExamSchedule> findByClassId(Long classId);
    List<ExamSchedule> findByClassIdAndExamDate(Long classId, String examDate);

    ExamSchedule findTopByClassIdOrderByIdDesc(Long classId);
    List<ExamSchedule> findByClassIdAndExamType(Long classId, ExamType examType);

}