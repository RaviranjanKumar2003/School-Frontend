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

    // ✅ CREATE CLASS
    @PostMapping
    public ClassDTO createClass(@RequestBody ClassDTO dto) {
        return classService.createClass(dto);
    }

    // ✅ GET ALL
    @GetMapping
    public List<ClassDTO> getAll() {
        return classService.getAllClasses();
    }

    // ✅ DELETE CLASS
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        classService.deleteClass(id);
    }

    // ✅ ADD SUBJECT
    @PostMapping("/{classId}/subject")
    public ClassDTO addSubject(
            @PathVariable Long classId,
            @RequestParam String subjectName
    ) {
        return classService.addSubject(classId, subjectName);
    }

    // ✅ DELETE SUBJECT
    @DeleteMapping("/{classId}/subject")
    public void deleteSubject(
            @PathVariable Long classId,
            @RequestParam String subjectName
    ) {
        classService.deleteSubject(classId, subjectName);
    }
}