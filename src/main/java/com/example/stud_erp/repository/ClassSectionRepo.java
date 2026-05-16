package com.example.stud_erp.repository;

import com.example.stud_erp.entity.ClassSectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassSectionRepo extends JpaRepository<ClassSectionEntity, Long> {

        List<ClassSectionEntity> findByClassEntityId(Long classId);
}
