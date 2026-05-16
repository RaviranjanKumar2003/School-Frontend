package com.example.stud_erp.repository;

import com.example.stud_erp.entity.SchoolAdmin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolAdminRepository extends JpaRepository<SchoolAdmin, Long> {

    SchoolAdmin findByUsername(String username);
}