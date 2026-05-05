package com.example.stud_erp.service;

import com.example.stud_erp.entity.Attendance;
import com.example.stud_erp.entity.TeacherAttendance;
import com.example.stud_erp.payload.ClassSessionDTO;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    ClassSessionDTO saveAttendance(ClassSessionDTO dto);

    List<ClassSessionDTO> getClassAttendance(Integer classNumber);

    List<ClassSessionDTO> getStudentAttendance(Long studentId);

    List<Attendance> getByDate(LocalDate date);

    ClassSessionDTO getClassAttendanceByDate(Integer classNumber, LocalDate date);
}