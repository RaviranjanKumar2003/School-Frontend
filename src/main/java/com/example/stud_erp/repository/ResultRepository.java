package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByStudentId(Long studentId);

    // 🔥 MUST FOR RECHECK SYSTEM
    Optional<Result> findByStudentIdAndSubject(Long studentId, String subject);
    List<Result> findByStudentIdAndPublishStatus(Long studentId, String publishStatus);
    List<Result> findByExamId(Long examId);
    Optional<Result> findByStudentIdAndExamId(Long studentId, Long examId);
    Optional<Result> findByStudentIdAndSubjectAndExamId(
            Long studentId,
            String subject,
            Long examId
    );

    List<Result> findByStudentIdAndExamIdAndPublishStatus(
            Long studentId,
            Long examId,
            String publishStatus
    );
}