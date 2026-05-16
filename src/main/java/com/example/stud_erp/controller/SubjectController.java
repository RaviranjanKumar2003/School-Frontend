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

    // ================= ADD SUBJECT =================
    @PostMapping("/{schoolId}/{classId}")
    public SubjectDTO addSubject(
            @PathVariable Long schoolId,
            @PathVariable Long classId,
            @RequestParam String subjectName
    ) {

        SubjectDTO dto = new SubjectDTO();

        dto.setSchoolId(schoolId); // ⭐ IMPORTANT
        dto.setClassId(classId);
        dto.setSubjectName(subjectName);

        return subjectService.addSubject(dto);
    }

    // ================= GET BY CLASS =================
    @GetMapping("/school/{schoolId}/class/{classId}")
    public List<SubjectDTO> getByClass(
            @PathVariable Long schoolId,
            @PathVariable Long classId
    ) {
        return subjectService.getSubjectsByClass(schoolId, classId);
    }

    // ================= GET BY SCHOOL =================
    @GetMapping("/school/{schoolId}")
    public List<SubjectDTO> getBySchool(@PathVariable Long schoolId) {
        return subjectService.getSubjectsBySchool(schoolId);
    }

    // ================= DELETE =================
    @DeleteMapping("/{schoolId}/{subjectId}")
    public void delete(
            @PathVariable Long schoolId,
            @PathVariable Long subjectId
    ) {
        subjectService.deleteSubject(schoolId, subjectId);
    }
}