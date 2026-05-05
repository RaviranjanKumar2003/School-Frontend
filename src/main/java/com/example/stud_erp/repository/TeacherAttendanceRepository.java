package com.example.stud_erp.repository;

import com.example.stud_erp.entity.TeacherAttendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TeacherAttendanceRepository extends JpaRepository<TeacherAttendance, Long> {

    TeacherAttendance findByTeacherIdAndDate(Long teacherId, LocalDate date);

    List<TeacherAttendance> findByDate(LocalDate date);
}