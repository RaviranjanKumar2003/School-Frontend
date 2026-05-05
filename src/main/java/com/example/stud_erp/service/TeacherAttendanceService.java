package com.example.stud_erp.service;

import com.example.stud_erp.entity.TeacherAttendance;

import java.time.LocalDate;
import java.util.List;

public interface TeacherAttendanceService {

    String saveOrUpdate(List<TeacherAttendance> list);

    List<TeacherAttendance> getByDate(LocalDate date);
}