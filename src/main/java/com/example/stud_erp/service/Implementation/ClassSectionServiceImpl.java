package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.ClassEntity;
import com.example.stud_erp.entity.ClassSectionEntity;
import com.example.stud_erp.payload.ClassSectionDto;
import com.example.stud_erp.repository.ClassRepository;
import com.example.stud_erp.repository.ClassSectionRepo;
import com.example.stud_erp.service.ClassSectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassSectionServiceImpl
        implements ClassSectionService {

    @Autowired
    private ClassRepository classRepo;

    @Autowired
    private ClassSectionRepo sectionRepo;

    // ================= ADD SECTION =================
    @Override
    public ClassSectionDto addSection(

            Long schoolId,
            Long classId,
            String sectionName
    ) {

        // FIND CLASS
        ClassEntity cls =
                classRepo.findById(classId)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Class not found"
                                ));

        // SECURITY CHECK
        if (!cls.getSchoolId().equals(schoolId)) {

            throw new RuntimeException(
                    "Unauthorized access"
            );
        }

        // CREATE SECTION
        ClassSectionEntity section =
                new ClassSectionEntity();

        section.setSectionName(sectionName);

        section.setSchoolId(schoolId);

        section.setClassEntity(cls);

        // SAVE
        ClassSectionEntity saved =
                sectionRepo.save(section);

        return convertToDto(saved);
    }

    // ================= UPDATE SECTION =================
    @Override
    public ClassSectionDto updateSection(

            Long schoolId,
            Long classId,
            Long sectionId,
            ClassSectionDto dto
    ) {

        ClassSectionEntity section =
                sectionRepo.findById(sectionId)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Section not found"
                                ));

        // SECURITY CHECK
        if (!section.getSchoolId().equals(schoolId)) {

            throw new RuntimeException(
                    "Unauthorized update"
            );
        }

        // CLASS CHECK
        if (!section.getClassEntity()
                .getId()
                .equals(classId)) {

            throw new RuntimeException(
                    "Section does not belong to class"
            );
        }

        // UPDATE
        section.setSectionName(
                dto.getSectionName()
        );

        ClassSectionEntity updated =
                sectionRepo.save(section);

        return convertToDto(updated);
    }

    // ================= DELETE SECTION =================
    @Override
    public void deleteSection(

            Long schoolId,
            Long classId,
            Long sectionId
    ) {

        ClassSectionEntity section =
                sectionRepo.findById(sectionId)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Section not found"
                                ));

        // SECURITY CHECK
        if (!section.getSchoolId().equals(schoolId)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        // CLASS CHECK
        if (!section.getClassEntity()
                .getId()
                .equals(classId)) {

            throw new RuntimeException(
                    "Invalid class"
            );
        }

        sectionRepo.delete(section);
    }

    // ================= GET SECTIONS BY CLASS =================
    @Override
    public List<ClassSectionDto> getSectionsByClass(

            Long schoolId,
            Long classId
    ) {

        return sectionRepo.findByClassEntityId(classId)

                .stream()

                .filter(section ->
                        section.getSchoolId()
                                .equals(schoolId)
                )

                .map(this::convertToDto)

                .collect(Collectors.toList());
    }

    // ================= DTO CONVERTER =================
    private ClassSectionDto convertToDto(
            ClassSectionEntity section
    ) {

        ClassSectionDto dto =
                new ClassSectionDto();

        dto.setId(section.getId());

        dto.setSectionName(
                section.getSectionName()
        );

        dto.setClassId(
                section.getClassEntity().getId()
        );

        return dto;
    }
}