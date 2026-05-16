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

    // ================= CREATE CLASS =================
    @Override
    public ClassDTO createClass(Long schoolId, ClassDTO dto) {

        ClassEntity cls = new ClassEntity();

        cls.setClassName(dto.getClassName());

        cls.setSchoolId(schoolId);

        ClassEntity saved = classRepo.save(cls);

        return convertToDTO(saved);
    }

    // ================= GET ALL =================
    @Override
    public List<ClassDTO> getAllClasses() {

        return classRepo.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET BY SCHOOL =================
    @Override
    public List<ClassDTO> getClassesBySchool(Long schoolId) {

        return classRepo.findAll()
                .stream()
                .filter(c -> c.getSchoolId() != null
                        && c.getSchoolId().equals(schoolId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET SINGLE CLASS =================
    @Override
    public ClassDTO getClassById(Long schoolId, Long classId) {

        ClassEntity cls = classRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        // ⭐ SECURITY CHECK
        if (!cls.getSchoolId().equals(schoolId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return convertToDTO(cls);
    }

    // ================= DELETE CLASS =================
    @Override
    public void deleteClass(Long schoolId, Long classId) {

        ClassEntity cls = classRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        // ⭐ SECURITY CHECK
        if (!cls.getSchoolId().equals(schoolId)) {
            throw new RuntimeException("Unauthorized delete attempt");
        }

        classRepo.delete(cls);
    }

    // ================= ADD SUBJECT =================
    @Override
    public ClassDTO addSubject(Long schoolId, Long classId, String subjectName) {

        ClassEntity cls = classRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        // ⭐ SECURITY CHECK
        if (!cls.getSchoolId().equals(schoolId)) {
            throw new RuntimeException("Unauthorized access");
        }

        Subject sub = new Subject();
        sub.setSubjectName(subjectName);
        sub.setClassEntity(cls);

        int count = cls.getSubjects() == null ? 0 : cls.getSubjects().size();
        sub.setNumber(count + 1);

        subjectRepo.save(sub);

        if (cls.getSubjects() != null) {
            cls.getSubjects().add(sub);
        }

        return convertToDTO(cls);
    }

    // ================= DELETE SUBJECT =================
    @Override
    public void deleteSubject(Long schoolId, Long classId, String subjectName) {

        ClassEntity cls = classRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        // ⭐ SECURITY CHECK
        if (!cls.getSchoolId().equals(schoolId)) {
            throw new RuntimeException("Unauthorized access");
        }

        if (cls.getSubjects() != null) {
            cls.getSubjects().removeIf(
                    s -> s.getSubjectName().equalsIgnoreCase(subjectName)
            );
        }

        classRepo.save(cls);
    }

    // ================= DTO MAPPER =================
    private ClassDTO convertToDTO(ClassEntity cls) {

        ClassDTO dto = new ClassDTO();

        dto.setId(cls.getId());

        dto.setClassName(cls.getClassName());

        dto.setSchoolId(cls.getSchoolId());

        if (cls.getSubjects() != null) {

            List<SubjectDTO> subjectList = cls.getSubjects()
                    .stream()
                    .map(sub -> {

                        SubjectDTO s = new SubjectDTO();

                        s.setId(sub.getId());

                        s.setSubjectName(
                                sub.getSubjectName()
                        );

                        s.setClassId(cls.getId());

                        s.setNumber(
                                sub.getNumber()
                        );

                        return s;

                    }).collect(Collectors.toList());

            dto.setSubjects(subjectList);
        }

        return dto;
    }
}