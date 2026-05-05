package com.example.stud_erp.service;

import com.example.stud_erp.payload.ClassDTO;
import java.util.List;

public interface ClassService {

    ClassDTO createClass(ClassDTO dto);

    List<ClassDTO> getAllClasses();

    void deleteClass(Long id);

    ClassDTO addSubject(Long classId, String subjectName);

    void deleteSubject(Long classId, String subjectName);
}