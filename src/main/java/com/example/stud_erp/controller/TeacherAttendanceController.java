package com.example.stud_erp.controller;

import com.example.stud_erp.entity.TeacherAttendance;
import com.example.stud_erp.service.Implementation.TeacherAttendanceServiceImpl;
import com.example.stud_erp.service.TeacherAttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance/teacher")
@CrossOrigin("*")
public class TeacherAttendanceController {

    @Autowired
    private TeacherAttendanceServiceImpl service;

    @Autowired
    private TeacherAttendanceService teacherAttendanceService;

    // SAVE
    @PostMapping("/save")
    public String save(@RequestBody List<TeacherAttendance> list) {
        return service.saveOrUpdate(list);
    }


    @GetMapping
    public List<TeacherAttendance> getByDate(@RequestParam String date) {
        return teacherAttendanceService.getByDate(LocalDate.parse(date));
    }
}