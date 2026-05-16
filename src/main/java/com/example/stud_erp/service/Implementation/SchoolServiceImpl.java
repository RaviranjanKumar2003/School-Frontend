package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.School;
import com.example.stud_erp.entity.SchoolAdmin;
import com.example.stud_erp.payload.SchoolAdminDto;
import com.example.stud_erp.payload.SchoolDto;
import com.example.stud_erp.repository.SchoolRepository;
import com.example.stud_erp.service.ImageService;
import com.example.stud_erp.service.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchoolServiceImpl implements SchoolService {

    private final SchoolRepository schoolRepository;

    @Autowired
    private ImageService imageService;

    public SchoolServiceImpl(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }

    // ================= CREATE =================
    @Override
    public SchoolDto createSchool(SchoolDto dto) {

        School school = new School();

        // ================= SCHOOL =================
        school.setSchoolName(dto.getSchoolName());
        school.setSchoolCode(dto.getSchoolCode());
        school.setAddress(dto.getAddress());
        school.setEmail(dto.getEmail());
        school.setPhone(dto.getPhone());

        // ================= SCHOOL ADMIN =================
        if (dto.getSchoolAdmin() != null) {

            SchoolAdmin admin = new SchoolAdmin();

            admin.setName(
                    dto.getSchoolAdmin().getName()
            );

            admin.setUsername(
                    dto.getSchoolAdmin().getUsername()
            );

            admin.setPassword(
                    dto.getSchoolAdmin().getPassword()
            );

            admin.setEmail(
                    dto.getSchoolAdmin().getEmail()
            );

            admin.setPhone(
                    dto.getSchoolAdmin().getPhone()
            );

            // IMPORTANT
            admin.setSchool(school);

            // IMPORTANT
            school.setSchoolAdmin(admin);
        }

        // ================= SAVE =================
        School savedSchool =
                schoolRepository.save(school);

        return mapToDto(savedSchool);
    }

    // ================= UPDATE =================
    @Override
    public SchoolDto updateSchool(Long id, SchoolDto dto) {

        School school = schoolRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("School not found"));

        // ================= SCHOOL UPDATE =================

        school.setSchoolName(dto.getSchoolName());
        school.setSchoolCode(dto.getSchoolCode());
        school.setAddress(dto.getAddress());
        school.setEmail(dto.getEmail());
        school.setPhone(dto.getPhone());

        // ================= SCHOOL ADMIN UPDATE =================

        if (dto.getSchoolAdmin() != null) {

            SchoolAdmin admin;

            // Existing admin hai to update karo
            if (school.getSchoolAdmin() != null) {

                admin = school.getSchoolAdmin();

            } else {

                // Naya admin create karo
                admin = new SchoolAdmin();
            }

            admin.setName(dto.getSchoolAdmin().getName());
            admin.setUsername(dto.getSchoolAdmin().getUsername());
            admin.setPassword(dto.getSchoolAdmin().getPassword());
            admin.setEmail(dto.getSchoolAdmin().getEmail());
            admin.setPhone(dto.getSchoolAdmin().getPhone());

            admin.setSchool(school);

            school.setSchoolAdmin(admin);
        }

        School updatedSchool = schoolRepository.save(school);

        return mapToDto(updatedSchool);
    }

    // ================= DELETE =================
    @Override
    public void deleteSchool(Long id) {

        School school = schoolRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("School not found"));

        schoolRepository.delete(school);
    }

    // ================= GET BY ID =================
    @Override
    public SchoolDto getSchoolById(Long id) {

        School school = schoolRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("School not found"));

        return mapToDto(school);
    }

    // ================= GET ALL =================
    @Override
    public List<SchoolDto> getAllSchools() {

        return schoolRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ================= DTO MAPPER =================
    private SchoolDto mapToDto(School school) {

        SchoolDto dto = new SchoolDto();

        dto.setId(school.getId());
        dto.setSchoolName(school.getSchoolName());
        dto.setSchoolCode(school.getSchoolCode());
        dto.setAddress(school.getAddress());
        dto.setEmail(school.getEmail());
        dto.setPhone(school.getPhone());

        dto.setCoverImages(
                school.getCoverImages()
        );

        // ================= SCHOOL ADMINS =================

        List<SchoolAdminDto> adminDtos = new ArrayList<>();

        // ================= SCHOOL ADMIN =================
        if (school.getSchoolAdmin() != null) {

            SchoolAdminDto adminDto =
                    new SchoolAdminDto();

            adminDto.setId(
                    school.getSchoolAdmin().getId()
            );

            adminDto.setName(
                    school.getSchoolAdmin().getName()
            );

            adminDto.setUsername(
                    school.getSchoolAdmin().getUsername()
            );

            adminDto.setPassword(
                    school.getSchoolAdmin().getPassword()
            );

            adminDto.setEmail(
                    school.getSchoolAdmin().getEmail()
            );

            adminDto.setPhone(
                    school.getSchoolAdmin().getPhone()
            );

            dto.setSchoolAdmin(adminDto);
        }

        return dto;
    }


//============================================================================= COVER IMAGE

    @Override
    public School uploadCoverImages(
            Long schoolId,
            List<MultipartFile> images
    ) throws IOException {

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new RuntimeException("School not found"));

        List<String> coverImages = school.getCoverImages();

        if (coverImages == null) {
            coverImages = new ArrayList<>();
        }

        for (MultipartFile file : images) {

            if (file != null && !file.isEmpty()) {

                String fileName =
                        imageService.uploadImage(file);

                coverImages.add(fileName);
            }
        }

        school.setCoverImages(coverImages);

        return schoolRepository.save(school);
    }
}