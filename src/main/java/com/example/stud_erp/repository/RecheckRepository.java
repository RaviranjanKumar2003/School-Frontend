package com.example.stud_erp.repository;

import com.example.stud_erp.entity.RecheckRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecheckRepository extends JpaRepository<RecheckRequest, Long> {

    // ✅ Student ke sabhi recheck request
    List<RecheckRequest> findByStudentId(Long studentId);

    // ✅ Pending / Approved / Rejected filter
    List<RecheckRequest> findByStatus(String status);

    // 🔥 MULTI SUBJECT SUPPORT (IMPORTANT)
    List<RecheckRequest> findByStudentIdAndSubjectsContaining(Long studentId, String subject);

    List<RecheckRequest> findByStudentIdAndExamIdAndSubjectsContaining(
            Long studentId,
            Long examId,
            String subject
    );
}