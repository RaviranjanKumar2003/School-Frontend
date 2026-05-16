package com.example.stud_erp.service;

import com.example.stud_erp.payload.SubjectDTO;
import java.util.List;

public interface SubjectService {

    SubjectDTO addSubject(SubjectDTO dto);

    List<SubjectDTO> getSubjectsByClass(Long schoolId, Long classId);

    List<SubjectDTO> getSubjectsBySchool(Long schoolId);

    void deleteSubject(Long schoolId, Long subjectId);
}