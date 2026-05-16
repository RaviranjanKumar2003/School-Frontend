package com.example.stud_erp.service;

import com.example.stud_erp.entity.School;
import com.example.stud_erp.payload.SchoolDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface SchoolService {

    SchoolDto createSchool(SchoolDto dto);

    SchoolDto updateSchool(Long id, SchoolDto dto);

    void deleteSchool(Long id);

    SchoolDto getSchoolById(Long id);

    List<SchoolDto> getAllSchools();

    School uploadCoverImages(
            Long schoolId,
            List<MultipartFile> images
    ) throws IOException;
}