package com.example.stud_erp.controller;

import com.example.stud_erp.payload.ClassSectionDto;
import com.example.stud_erp.service.ClassSectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
@CrossOrigin(origins = "*")
public class ClassSectionController {

    @Autowired
    private ClassSectionService sectionService;

    // =========================================================
    // ADD SECTION
    // =========================================================
    @PostMapping("/{schoolId}/{classId}")
    public ClassSectionDto addSection(

            @PathVariable Long schoolId,

            @PathVariable Long classId,

            @RequestParam String sectionName
    ) {

        return sectionService.addSection(
                schoolId,
                classId,
                sectionName
        );
    }

    // =========================================================
    // UPDATE SECTION
    // =========================================================
    @PutMapping("/{schoolId}/{classId}/{sectionId}")
    public ClassSectionDto updateSection(

            @PathVariable Long schoolId,

            @PathVariable Long classId,

            @PathVariable Long sectionId,

            @RequestBody ClassSectionDto dto
    ) {

        return sectionService.updateSection(
                schoolId,
                classId,
                sectionId,
                dto
        );
    }

    // =========================================================
    // DELETE SECTION
    // =========================================================
    @DeleteMapping("/{schoolId}/{classId}/{sectionId}")
    public void deleteSection(

            @PathVariable Long schoolId,

            @PathVariable Long classId,

            @PathVariable Long sectionId
    ) {

        sectionService.deleteSection(
                schoolId,
                classId,
                sectionId
        );
    }

    // =========================================================
    // GET ALL SECTIONS OF CLASS
    // =========================================================
    @GetMapping("/{schoolId}/{classId}")
    public List<ClassSectionDto> getSectionsByClass(

            @PathVariable Long schoolId,

            @PathVariable Long classId
    ) {

        return sectionService.getSectionsByClass(
                schoolId,
                classId
        );
    }
}