package com.example.stud_erp.service;

import com.example.stud_erp.payload.ClassSectionDto;

import java.util.List;

public interface ClassSectionService {

    // ================= ADD SECTION =================
    ClassSectionDto addSection(

            Long schoolId,

            Long classId,

            String sectionName
    );

    // ================= UPDATE SECTION =================
    ClassSectionDto updateSection(

            Long schoolId,

            Long classId,

            Long sectionId,

            ClassSectionDto dto
    );

    // ================= DELETE SECTION =================
    void deleteSection(

            Long schoolId,

            Long classId,

            Long sectionId
    );

    // ================= GET SECTIONS BY CLASS =================
    List<ClassSectionDto> getSectionsByClass(

            Long schoolId,

            Long classId
    );
}