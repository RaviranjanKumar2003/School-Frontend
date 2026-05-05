package com.example.stud_erp.controller;

import com.example.stud_erp.payload.SubjectDTO;
import com.example.stud_erp.service.SubjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    // ✅ ADD SUBJECT
    @PostMapping
    public SubjectDTO addSubject(@RequestBody SubjectDTO dto) {
        return subjectService.addSubject(dto);
    }

    // ✅ GET SUBJECTS BY CLASS
    @GetMapping("/class/{classId}")
    public List<SubjectDTO> getSubjects(@PathVariable Long classId) {
        return subjectService.getSubjectsByClass(classId);
    }

    // ✅ DELETE SUBJECT
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }
}