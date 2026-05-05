package com.example.stud_erp.repository;

import com.example.stud_erp.entity.ExamNotice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamNoticeRepository extends JpaRepository<ExamNotice, Long> {

    List<ExamNotice> findByTeacherId(Long teacherId);

}