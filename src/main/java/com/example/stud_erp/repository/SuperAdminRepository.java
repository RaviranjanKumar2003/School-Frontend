package com.example.stud_erp.repository;

import com.example.stud_erp.entity.SuperAdmin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {

    SuperAdmin findByUsername(String username);

    SuperAdmin findByEmail(String email);
}