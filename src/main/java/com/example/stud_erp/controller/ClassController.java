package com.example.stud_erp.controller;

import com.example.stud_erp.payload.ClassDTO;
import com.example.stud_erp.service.ClassService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin
public class ClassController {

    @Autowired
    private ClassService classService;

    // ================= CREATE CLASS =================
    @PostMapping("/{schoolId}")
    public ClassDTO createClass(
            @PathVariable Long schoolId,
            @RequestBody ClassDTO dto
    ) {
        return classService.createClass(schoolId, dto);
    }

    // ================= GET ALL (GLOBAL - optional admin use) =================
    @GetMapping
    public List<ClassDTO> getAll() {
        return classService.getAllClasses();
    }

    // ================= GET BY SCHOOL =================
    @GetMapping("/by-school/{schoolId}")
    public List<ClassDTO> getBySchool(@PathVariable Long schoolId) {
        return classService.getClassesBySchool(schoolId);
    }

    // ================= GET SINGLE CLASS =================
    @GetMapping("/{schoolId}/{classId}")
    public ClassDTO getClassById(
            @PathVariable Long schoolId,
            @PathVariable Long classId
    ) {
        return classService.getClassById(schoolId, classId);
    }

    // ================= DELETE CLASS =================
    @DeleteMapping("/{schoolId}/{classId}")
    public void deleteClass(
            @PathVariable Long schoolId,
            @PathVariable Long classId
    ) {
        classService.deleteClass(schoolId, classId);
    }

    // ================= ADD SUBJECT =================
    @PostMapping("/{schoolId}/{classId}/subject")
    public ClassDTO addSubject(
            @PathVariable Long schoolId,
            @PathVariable Long classId,
            @RequestParam String subjectName
    ) {
        return classService.addSubject(schoolId, classId, subjectName);
    }

    // ================= DELETE SUBJECT =================
    @DeleteMapping("/{schoolId}/{classId}/subject")
    public void deleteSubject(
            @PathVariable Long schoolId,
            @PathVariable Long classId,
            @RequestParam String subjectName
    ) {
        classService.deleteSubject(schoolId, classId, subjectName);
    }
}