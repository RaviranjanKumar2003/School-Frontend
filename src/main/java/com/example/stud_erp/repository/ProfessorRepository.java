//package com.example.stud_erp.repository;
//
//import com.example.stud_erp.entity.Professor;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface ProfessorRepository extends JpaRepository<Professor, Long> {
//
//    // ================= FILTERS =================
//    List<Professor> findBySchool_Id(Long schoolId);
//
//    List<Professor> findByHod_Id(Long hodId);
//
//    List<Professor> findBySchool_IdAndHod_Id(Long schoolId, Long hodId);
//
//    // ================= LOGIN =================
//    Optional<Professor> findByUsername(String username);
//}



package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    // ================= FILTERS =================

    List<Professor> findBySchool_Id(Long schoolId);

    List<Professor> findBySchoolAdmin_Id(Long schoolAdminId);

    List<Professor> findBySchool_IdAndSchoolAdmin_Id(
            Long schoolId,
            Long schoolAdminId
    );

    // ================= LOGIN =================

    Optional<Professor> findByUsername(String username);
}