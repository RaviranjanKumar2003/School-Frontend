package com.example.stud_erp.repository;

import com.example.stud_erp.entity.SubjectSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectSessionRepository extends JpaRepository<SubjectSession, Long> {

}