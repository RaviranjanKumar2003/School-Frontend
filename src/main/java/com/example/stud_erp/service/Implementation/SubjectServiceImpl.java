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

    // ✅ ADD SUBJECT
    @Override
    public SubjectDTO addSubject(SubjectDTO dto) {

        ClassEntity cls = classRepo.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        Subject subject = new Subject();
        subject.setSubjectName(dto.getSubjectName());
        subject.setClassEntity(cls);

        Subject saved = subjectRepo.save(subject);

        dto.setId(saved.getId());
        return dto;
    }

    // ✅ GET SUBJECTS BY CLASS
    @Override
    public List<SubjectDTO> getSubjectsByClass(Long classId) {

        return subjectRepo.findByClassEntityId(classId)
                .stream()
                .map(sub -> {
                    SubjectDTO dto = new SubjectDTO();
                    dto.setId(sub.getId());
                    dto.setSubjectName(sub.getSubjectName());
                    dto.setClassId(sub.getClassEntity().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ✅ DELETE SUBJECT
    @Override
    public void deleteSubject(Long subjectId) {
        subjectRepo.deleteById(subjectId);
    }
}