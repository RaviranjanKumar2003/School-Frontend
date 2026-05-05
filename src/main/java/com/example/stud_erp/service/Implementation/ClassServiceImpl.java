package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.ClassEntity;
import com.example.stud_erp.entity.Subject;
import com.example.stud_erp.payload.ClassDTO;
import com.example.stud_erp.payload.SubjectDTO;
import com.example.stud_erp.repository.ClassRepository;
import com.example.stud_erp.repository.SubjectRepository;
import com.example.stud_erp.service.ClassService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassServiceImpl implements ClassService {

    @Autowired
    private ClassRepository classRepo;

    @Autowired
    private SubjectRepository subjectRepo;

    // ✅ CREATE CLASS
    @Override
    public ClassDTO createClass(ClassDTO dto) {
        ClassEntity cls = new ClassEntity();
        cls.setClassName(dto.getClassName());

        ClassEntity saved = classRepo.save(cls);

        return convertToDTO(saved); // ✅ better return
    }

    // ✅ GET ALL
    @Override
    public List<ClassDTO> getAllClasses() {
        return classRepo.findAll()
                .stream()
                .map(this::convertToDTO) // ✅ reusable method
                .collect(Collectors.toList());
    }

    // ✅ DELETE CLASS
    @Override
    public void deleteClass(Long id) {
        classRepo.deleteById(id);
    }

    // ✅ ADD SUBJECT
    @Override
    public ClassDTO addSubject(Long classId, String subjectName) {

        ClassEntity cls = classRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        Subject sub = new Subject();
        sub.setSubjectName(subjectName);
        sub.setClassEntity(cls);

        // ✅ Auto numbering (important)
        int count = cls.getSubjects() == null ? 0 : cls.getSubjects().size();
        sub.setNumber(count + 1);

        subjectRepo.save(sub);

        if (cls.getSubjects() != null) {
            cls.getSubjects().add(sub);
        }

        return convertToDTO(cls); // ✅ direct return (fast)
    }

    // ✅ DELETE SUBJECT
    @Override
    public void deleteSubject(Long classId, String subjectName) {

        ClassEntity cls = classRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        if (cls.getSubjects() != null) {
            cls.getSubjects().removeIf(
                    s -> s.getSubjectName().equalsIgnoreCase(subjectName)
            );
        }

        classRepo.save(cls);
    }

    // ✅ COMMON DTO MAPPER (MOST IMPORTANT)
    private ClassDTO convertToDTO(ClassEntity cls) {

        ClassDTO dto = new ClassDTO();
        dto.setId(cls.getId());
        dto.setClassName(cls.getClassName());

        if (cls.getSubjects() != null) {

            List<SubjectDTO> subjectList = cls.getSubjects()
                    .stream()
                    .map(sub -> {
                        SubjectDTO s = new SubjectDTO();
                        s.setId(sub.getId());
                        s.setSubjectName(sub.getSubjectName());
                        s.setClassId(cls.getId()); // ✅ important
                        s.setNumber(sub.getNumber()); // ✅ important
                        return s;
                    })
                    .collect(Collectors.toList());

            dto.setSubjects(subjectList);
        }

        return dto;
    }
}