package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.ClassEntity;
import com.example.stud_erp.entity.Subject;
import com.example.stud_erp.payload.SubjectDTO;
import com.example.stud_erp.repository.ClassRepository;
import com.example.stud_erp.repository.SubjectRepository;
import com.example.stud_erp.service.SubjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    private SubjectRepository subjectRepo;

    @Autowired
    private ClassRepository classRepo;

    // ================= ADD SUBJECT =================
    @Override
    public SubjectDTO addSubject(SubjectDTO dto) {

        ClassEntity cls = classRepo.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        Subject subject = new Subject();

        subject.setSubjectName(dto.getSubjectName());
        subject.setClassEntity(cls);
        subject.setSchoolId(dto.getSchoolId()); // ⭐ IMPORTANT

        Subject saved = subjectRepo.save(subject);

        dto.setId(saved.getId());
        return dto;
    }

    // ================= GET BY CLASS =================
    @Override
    public List<SubjectDTO> getSubjectsByClass(Long schoolId, Long classId) {

        return subjectRepo.findByClassEntityId(classId)
                .stream()
                .filter(s -> s.getSchoolId().equals(schoolId)) // ⭐ SECURITY
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET BY SCHOOL =================
    @Override
    public List<SubjectDTO> getSubjectsBySchool(Long schoolId) {

        return subjectRepo.findBySchoolId(schoolId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= DELETE SUBJECT =================
    @Override
    public void deleteSubject(Long schoolId, Long subjectId) {

        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (!subject.getSchoolId().equals(schoolId)) {
            throw new RuntimeException("Unauthorized delete");
        }

        subjectRepo.delete(subject);
    }

    // ================= MAPPER =================
    private SubjectDTO mapToDTO(Subject sub) {

        SubjectDTO dto = new SubjectDTO();

        dto.setId(sub.getId());
        dto.setSubjectName(sub.getSubjectName());
        dto.setClassId(sub.getClassEntity().getId());
        dto.setSchoolId(sub.getSchoolId());
        dto.setNumber(sub.getNumber());

        return dto;
    }
}