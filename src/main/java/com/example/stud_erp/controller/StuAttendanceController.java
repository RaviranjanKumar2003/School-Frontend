package com.example.stud_erp.controller;

import com.example.stud_erp.payload.StuAttendanceDTO;
import com.example.stud_erp.service.StuAttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stu-attendance")
@CrossOrigin("*")
public class StuAttendanceController {

    @Autowired
    private StuAttendanceService service;

    @PostMapping("/save")
    public String save(
            @RequestParam Integer classNumber,
            @RequestParam String date,
            @RequestBody List<StuAttendanceDTO> list
    ) {
        return service.save(classNumber, LocalDate.parse(date), list);
    }

    @GetMapping
    public List<StuAttendanceDTO> get(
            @RequestParam Integer classNumber,
            @RequestParam String date
    ) {
        return service.getByClassAndDate(classNumber, LocalDate.parse(date));
    }
}