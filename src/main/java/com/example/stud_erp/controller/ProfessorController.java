package com.example.stud_erp.controller;

import com.example.stud_erp.entity.Professor;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ProfessorDTO;
import com.example.stud_erp.service.ImageService;
import com.example.stud_erp.service.ProfessorService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/professors")
@CrossOrigin("*")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private ImageService imageService;

    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Professor professor = professorService.authenticateUser(request);

        return ResponseEntity.ok(professor);
    }

    // ================= CREATE =================
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Professor createProfessor(

            @RequestParam("schoolCode") String schoolCode,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("designation") String designation,
            @RequestParam("qualification") String qualification,
            @RequestParam("experience") String experience,
            @RequestParam("joiningDate") String joiningDate,
            @RequestParam("assignments") String assignmentsJson,

            @RequestParam(value = "image", required = false) MultipartFile image

    ) throws Exception {

        ProfessorDTO dto = new ProfessorDTO();

        dto.setSchoolCode(schoolCode);
        dto.setName(name);
        dto.setEmail(email);
        dto.setPhone(phone);
        dto.setDesignation(designation);
        dto.setQualification(qualification);
        dto.setExperience(experience);
        dto.setJoiningDate(joiningDate);

        dto.setAssignments(
                Arrays.asList(mapper.readValue(
                        assignmentsJson,
                        ProfessorDTO.AssignmentDTO[].class
                ))
        );

        return professorService.createProfessor(dto, image);
    }

    // ================= GET ALL =================
    @GetMapping
    public List<Professor> getAllProfessors() {
        return professorService.getAllProfessors();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public Professor getById(@PathVariable Long id) {
        return professorService.getProfessorById(id);
    }

    // ================= UPDATE =================
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Professor updateProfessor(
            @PathVariable Long id,

            @RequestParam("schoolCode") String schoolCode,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("designation") String designation,
            @RequestParam("qualification") String qualification,
            @RequestParam("experience") String experience,
            @RequestParam("joiningDate") String joiningDate,
            @RequestParam("assignments") String assignmentsJson,

            @RequestParam(value = "image", required = false) MultipartFile image

    ) throws Exception {

        ProfessorDTO dto = new ProfessorDTO();

        dto.setSchoolCode(schoolCode);
        dto.setName(name);
        dto.setEmail(email);
        dto.setPhone(phone);
        dto.setDesignation(designation);
        dto.setQualification(qualification);
        dto.setExperience(experience);
        dto.setJoiningDate(joiningDate);

        dto.setAssignments(
                Arrays.asList(mapper.readValue(
                        assignmentsJson,
                        ProfessorDTO.AssignmentDTO[].class
                ))
        );

        return professorService.updateProfessor(id, dto, image);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public String deleteProfessor(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        return "Professor deleted successfully";
    }




//===================================================== IMAGE =========================================

    @PostMapping("/image/upload/{id}")
    public ResponseEntity<Professor> uploadProfessorImage(
            @RequestParam("image") MultipartFile image,
            @PathVariable Long id
    ) throws Exception {

        Professor professor = professorService.getProfessorById(id);

        if (professor == null) {
            throw new RuntimeException("Professor not found");
        }

        // delete old image (optional)
        if (professor.getImageUrl() != null) {
            imageService.deleteImage(professor.getImageUrl());
        }

        // upload new image
        String fileName = imageService.uploadImage(image);
        professor.setImageUrl(fileName);

        return ResponseEntity.ok(professorService.saveProfessor(professor));
    }


    @GetMapping("/image/get/{id}")
    public void getProfessorImage(
            @PathVariable Long id,
            HttpServletResponse response
    ) throws Exception {

        Professor professor = professorService.getProfessorById(id);

        if (professor == null || professor.getImageUrl() == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("Image not found");
            return;
        }

        String imageName = Paths.get(professor.getImageUrl())
                .getFileName()
                .toString();

        try (InputStream inputStream = imageService.getResource(imageName)) {

            String contentType = URLConnection.guessContentTypeFromName(imageName);

            response.setContentType(
                    contentType != null ? contentType : "application/octet-stream"
            );

            StreamUtils.copy(inputStream, response.getOutputStream());
        }
    }
}