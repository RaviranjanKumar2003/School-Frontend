package com.example.stud_erp.service;

import com.example.stud_erp.payload.StuAttendanceDTO;

import java.time.LocalDate;
import java.util.List;

public interface StuAttendanceService {

    String save(Integer classNumber, LocalDate date, List<StuAttendanceDTO> list);

    List<StuAttendanceDTO> getByClassAndDate(Integer classNumber, LocalDate date);
}