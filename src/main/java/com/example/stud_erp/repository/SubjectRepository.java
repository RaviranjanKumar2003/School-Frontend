package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByClassEntityId(Long classId);
}