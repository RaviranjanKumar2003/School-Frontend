package com.example.stud_erp.service;

import com.example.stud_erp.payload.ClassDTO;
import java.util.List;

public interface ClassService {

    // ================= CREATE =================
    ClassDTO createClass(Long schoolId, ClassDTO dto);

    // ================= READ =================
    List<ClassDTO> getAllClasses();

    List<ClassDTO> getClassesBySchool(Long schoolId);

    ClassDTO getClassById(Long schoolId, Long classId);

    // ================= DELETE =================
    void deleteClass(Long schoolId, Long classId);

    // ================= SUBJECT =================
    ClassDTO addSubject(Long schoolId, Long classId, String subjectName);

    void deleteSubject(Long schoolId, Long classId, String subjectName);
}