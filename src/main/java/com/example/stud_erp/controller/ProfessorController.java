//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Professor;
//import com.example.stud_erp.payload.LoginRequest;
//import com.example.stud_erp.payload.ProfessorDTO;
//import com.example.stud_erp.service.ImageService;
//import com.example.stud_erp.service.ProfessorService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.util.StreamUtils;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.InputStream;
//import java.net.URLConnection;
//import java.nio.file.Paths;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/professors")
//@CrossOrigin("*")
//public class ProfessorController {
//
//    @Autowired
//    private ProfessorService professorService;
//
//    @Autowired
//    private ImageService imageService;
//
//    private final ObjectMapper mapper = new ObjectMapper();
//
//    // ================= LOGIN =================
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
//        Professor professor = professorService.authenticateUser(request);
//        return ResponseEntity.ok(professor);
//    }
//
//    // ================= CREATE =================
//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public Professor createProfessor(
//
//            @RequestParam("name") String name,
//            @RequestParam("email") String email,
//            @RequestParam("phone") String phone,
//            @RequestParam("designation") String designation,
//            @RequestParam("qualification") String qualification,
//            @RequestParam("experience") String experience,
//            @RequestParam("joiningDate") String joiningDate,
//
//            @RequestParam("schoolId") Long schoolId,
//            @RequestParam("hodId") Long hodId,
//
//            @RequestParam("assignments") String assignmentsJson,
//            @RequestParam(value = "image", required = false) MultipartFile image
//    ) throws Exception {
//
//        ProfessorDTO dto = new ProfessorDTO();
//
//        dto.setName(name);
//        dto.setEmail(email);
//        dto.setPhone(phone);
//        dto.setDesignation(designation);
//        dto.setQualification(qualification);
//        dto.setExperience(experience);
//        dto.setJoiningDate(joiningDate);
//
//        dto.setSchoolId(schoolId);
//        dto.setHodId(hodId);
//
//        dto.setAssignments(
//                Arrays.asList(
//                        mapper.readValue(assignmentsJson, ProfessorDTO.AssignmentDTO[].class)
//                )
//        );
//
//        return professorService.createProfessor(dto, image);
//    }
//
//    // ================= GET ALL =================
//    @GetMapping
//    public List<Professor> getAllProfessors() {
//        return professorService.getAllProfessors();
//    }
//
//    // ================= GET BY ID =================
//    @GetMapping("/{id}")
//    public Professor getById(@PathVariable Long id) {
//        return professorService.getProfessorById(id);
//    }
//
//    // =====================================================
//    // 🚀 FILTER APIs (IMPORTANT FOR HOD / SCHOOL LOGIC)
//    // =====================================================
//
//    // ================= BY SCHOOL =================
//    @GetMapping("/by-school/{schoolId}")
//    public List<Professor> getBySchool(@PathVariable Long schoolId) {
//        return professorService.getBySchoolId(schoolId);
//    }
//
//    // ================= BY HOD + SCHOOL =================
//    @GetMapping("/by-hod/{schoolId}/{hodId}")
//    public List<ProfessorDTO> getBySchoolAndHod(
//            @PathVariable Long schoolId,
//            @PathVariable Long hodId
//    ) {
//        return professorService.getBySchoolIdAndHodIdDTO(schoolId, hodId);
//    }
//
//    // =====================================================
//    // ⚠️ NOTE:
//    // getBySchoolAndClass removed (NOT IMPLEMENTED IN SERVICE)
//    // =====================================================
//
//    // ================= UPDATE =================
//    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public Professor updateProfessor(
//
//            @PathVariable Long id,
//
//            @RequestParam("name") String name,
//            @RequestParam("email") String email,
//            @RequestParam("phone") String phone,
//            @RequestParam("designation") String designation,
//            @RequestParam("qualification") String qualification,
//            @RequestParam("experience") String experience,
//            @RequestParam("joiningDate") String joiningDate,
//
//            @RequestParam("schoolId") Long schoolId,
//            @RequestParam("hodId") Long hodId,
//
//            // 🔥 NEW FLAG (IMPORTANT)
//            @RequestParam(value = "updateAssignments", required = false, defaultValue = "false")
//            Boolean updateAssignments,
//
//            @RequestParam(value = "assignments", required = false)
//            String assignmentsJson,
//
//            @RequestParam(value = "image", required = false)
//            MultipartFile image
//
//    ) throws Exception {
//
//        ProfessorDTO dto = new ProfessorDTO();
//
//        dto.setName(name);
//        dto.setEmail(email);
//        dto.setPhone(phone);
//        dto.setDesignation(designation);
//        dto.setQualification(qualification);
//        dto.setExperience(experience);
//        dto.setJoiningDate(joiningDate);
//
//        dto.setSchoolId(schoolId);
//        dto.setHodId(hodId);
//
//        // 🔥 IMPORTANT FLAG SET
//        dto.setUpdateAssignments(updateAssignments);
//
//        // ================= SAFE ASSIGNMENTS PARSE =================
//        if (Boolean.TRUE.equals(updateAssignments)
//                && assignmentsJson != null
//                && !assignmentsJson.isEmpty()) {
//
//            dto.setAssignments(
//                    Arrays.asList(
//                            mapper.readValue(
//                                    assignmentsJson,
//                                    ProfessorDTO.AssignmentDTO[].class
//                            )
//                    )
//            );
//
//        } else {
//            dto.setAssignments(new ArrayList<>());
//        }
//
//        return professorService.updateProfessor(id, dto, image);
//    }
//
//    // ================= DELETE =================
//    @DeleteMapping("/{id}")
//    public String deleteProfessor(@PathVariable Long id) {
//        professorService.deleteProfessor(id);
//        return "Professor deleted successfully";
//    }
//
//    // ================= IMAGE GET =================
//    @GetMapping("/image/get/{id}")
//    public void getProfessorImage(
//            @PathVariable Long id,
//            HttpServletResponse response
//    ) throws Exception {
//
//        Professor professor = professorService.getProfessorById(id);
//
//        if (professor == null || professor.getImageUrl() == null) {
//            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
//            response.getWriter().write("Image not found");
//            return;
//        }
//
//        String imageName = Paths.get(professor.getImageUrl()).getFileName().toString();
//
//        try (InputStream inputStream = imageService.getResource(imageName)) {
//
//            String contentType = URLConnection.guessContentTypeFromName(imageName);
//
//            response.setContentType(
//                    contentType != null ? contentType : "application/octet-stream"
//            );
//
//            StreamUtils.copy(inputStream, response.getOutputStream());
//        }
//    }
//
//
//    @PutMapping("/basic/{id}")
//    public Professor updateBasicInfo(
//            @PathVariable Long id,
//            @RequestBody ProfessorDTO dto,
//            @RequestParam(value = "image", required = false) MultipartFile image
//    ) throws Exception {
//
//        // 🚫 assignments ignore
//        dto.setAssignments(null);
//
//        return professorService.updateProfessorBasic(id, dto, image);
//    }
//
//
//
//    @PutMapping(value = "/full/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public Professor updateWithAssignments(
//            @PathVariable Long id,
//
//            @RequestParam("name") String name,
//            @RequestParam("email") String email,
//            @RequestParam("phone") String phone,
//            @RequestParam("designation") String designation,
//            @RequestParam("qualification") String qualification,
//            @RequestParam("experience") String experience,
//            @RequestParam("joiningDate") String joiningDate,
//            @RequestParam("schoolId") Long schoolId,
//            @RequestParam("hodId") Long hodId,
//            @RequestParam("assignments") String assignmentsJson,
//            @RequestParam(value = "image", required = false) MultipartFile image
//    ) throws Exception {
//
//        ProfessorDTO dto = new ProfessorDTO();
//
//        dto.setName(name);
//        dto.setEmail(email);
//        dto.setPhone(phone);
//        dto.setDesignation(designation);
//        dto.setQualification(qualification);
//        dto.setExperience(experience);
//        dto.setJoiningDate(joiningDate);
//        dto.setSchoolId(schoolId);
//        dto.setHodId(hodId);
//
//        dto.setAssignments(
//                Arrays.asList(
//                        mapper.readValue(assignmentsJson, ProfessorDTO.AssignmentDTO[].class)
//                )
//        );
//
//        return professorService.updateProfessor(id, dto, image);
//    }
//
//}




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
import java.util.ArrayList;
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

    private final ObjectMapper mapper =
            new ObjectMapper();

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        Professor professor =
                professorService.authenticateUser(request);

        return ResponseEntity.ok(professor);
    }

    // ================= CREATE =================
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Professor createProfessor(

            @RequestParam("name") String name,

            @RequestParam("email") String email,

            @RequestParam("phone") String phone,

            @RequestParam("designation") String designation,

            @RequestParam("qualification") String qualification,

            @RequestParam("experience") String experience,

            @RequestParam("joiningDate") String joiningDate,

            @RequestParam("schoolId") Long schoolId,

            // 🔥 CHANGED
            @RequestParam("schoolAdminId") Long schoolAdminId,

            @RequestParam("assignments") String assignmentsJson,

            @RequestParam(
                    value = "image",
                    required = false
            )
            MultipartFile image

    ) throws Exception {

        ProfessorDTO dto =
                new ProfessorDTO();

        dto.setName(name);

        dto.setEmail(email);

        dto.setPhone(phone);

        dto.setDesignation(designation);

        dto.setQualification(qualification);

        dto.setExperience(experience);

        dto.setJoiningDate(joiningDate);

        dto.setSchoolId(schoolId);

        // 🔥 CHANGED
        dto.setSchoolAdminId(
                schoolAdminId
        );

        dto.setAssignments(

                Arrays.asList(

                        mapper.readValue(
                                assignmentsJson,
                                ProfessorDTO.AssignmentDTO[].class
                        )
                )
        );

        return professorService
                .createProfessor(dto, image);
    }

    // ================= GET ALL =================
    @GetMapping
    public List<Professor> getAllProfessors() {

        return professorService
                .getAllProfessors();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public Professor getById(
            @PathVariable Long id
    ) {

        return professorService
                .getProfessorById(id);
    }

    // ================= FILTER BY SCHOOL =================
    @GetMapping("/by-school/{schoolId}")
    public List<Professor> getBySchool(
            @PathVariable Long schoolId
    ) {

        return professorService
                .getBySchoolId(schoolId);
    }

    // ================= FILTER BY SCHOOL + ADMIN =================
    @GetMapping(
            "/by-school-admin/{schoolId}/{schoolAdminId}"
    )
    public List<ProfessorDTO> getBySchoolAndAdmin(

            @PathVariable Long schoolId,

            @PathVariable Long schoolAdminId

    ) {

        return professorService
                .getBySchoolIdAndSchoolAdminIdDTO(
                        schoolId,
                        schoolAdminId
                );
    }

    // ================= UPDATE =================
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Professor updateProfessor(

            @PathVariable Long id,

            @RequestParam("name") String name,

            @RequestParam("email") String email,

            @RequestParam("phone") String phone,

            @RequestParam("designation") String designation,

            @RequestParam("qualification") String qualification,

            @RequestParam("experience") String experience,

            @RequestParam("joiningDate") String joiningDate,

            @RequestParam("schoolId") Long schoolId,

            // 🔥 CHANGED
            @RequestParam("schoolAdminId")
            Long schoolAdminId,

            @RequestParam(
                    value = "updateAssignments",
                    required = false,
                    defaultValue = "false"
            )
            Boolean updateAssignments,

            @RequestParam(
                    value = "assignments",
                    required = false
            )
            String assignmentsJson,

            @RequestParam(
                    value = "image",
                    required = false
            )
            MultipartFile image

    ) throws Exception {

        ProfessorDTO dto =
                new ProfessorDTO();

        dto.setName(name);

        dto.setEmail(email);

        dto.setPhone(phone);

        dto.setDesignation(designation);

        dto.setQualification(qualification);

        dto.setExperience(experience);

        dto.setJoiningDate(joiningDate);

        dto.setSchoolId(schoolId);

        // 🔥 CHANGED
        dto.setSchoolAdminId(
                schoolAdminId
        );

        dto.setUpdateAssignments(
                updateAssignments
        );

        // ================= ASSIGNMENTS =================
        if (
                Boolean.TRUE.equals(updateAssignments)
                        &&
                        assignmentsJson != null
                        &&
                        !assignmentsJson.isEmpty()
        ) {

            dto.setAssignments(

                    Arrays.asList(

                            mapper.readValue(
                                    assignmentsJson,
                                    ProfessorDTO.AssignmentDTO[].class
                            )
                    )
            );

        } else {

            dto.setAssignments(
                    new ArrayList<>()
            );
        }

        return professorService
                .updateProfessor(
                        id,
                        dto,
                        image
                );
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public String deleteProfessor(
            @PathVariable Long id
    ) {

        professorService
                .deleteProfessor(id);

        return "Professor deleted successfully";
    }

    // ================= IMAGE GET =================
    @GetMapping("/image/get/{id}")
    public void getProfessorImage(

            @PathVariable Long id,

            HttpServletResponse response

    ) throws Exception {

        Professor professor =
                professorService
                        .getProfessorById(id);

        if (
                professor == null
                        ||
                        professor.getImageUrl() == null
        ) {

            response.setStatus(
                    HttpServletResponse.SC_NOT_FOUND
            );

            response.getWriter()
                    .write("Image not found");

            return;
        }

        String imageName =
                Paths.get(
                                professor.getImageUrl()
                        )
                        .getFileName()
                        .toString();

        try (

                InputStream inputStream =
                        imageService.getResource(
                                imageName
                        )

        ) {

            String contentType =
                    URLConnection
                            .guessContentTypeFromName(
                                    imageName
                            );

            response.setContentType(

                    contentType != null
                            ? contentType
                            : "application/octet-stream"
            );

            StreamUtils.copy(
                    inputStream,
                    response.getOutputStream()
            );
        }
    }

    // ================= BASIC UPDATE =================
    @PutMapping("/basic/{id}")
    public Professor updateBasicInfo(

            @PathVariable Long id,

            @RequestBody ProfessorDTO dto,

            @RequestParam(
                    value = "image",
                    required = false
            )
            MultipartFile image

    ) throws Exception {

        // 🚫 IGNORE ASSIGNMENTS
        dto.setAssignments(null);

        return professorService
                .updateProfessorBasic(
                        id,
                        dto,
                        image
                );
    }

    // ================= FULL UPDATE =================
    @PutMapping(
            value = "/full/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Professor updateWithAssignments(

            @PathVariable Long id,

            @RequestParam("name") String name,

            @RequestParam("email") String email,

            @RequestParam("phone") String phone,

            @RequestParam("designation") String designation,

            @RequestParam("qualification") String qualification,

            @RequestParam("experience") String experience,

            @RequestParam("joiningDate") String joiningDate,

            @RequestParam("schoolId") Long schoolId,

            // 🔥 CHANGED
            @RequestParam("schoolAdminId")
            Long schoolAdminId,

            @RequestParam("assignments")
            String assignmentsJson,

            @RequestParam(
                    value = "image",
                    required = false
            )
            MultipartFile image

    ) throws Exception {

        ProfessorDTO dto =
                new ProfessorDTO();

        dto.setName(name);

        dto.setEmail(email);

        dto.setPhone(phone);

        dto.setDesignation(designation);

        dto.setQualification(qualification);

        dto.setExperience(experience);

        dto.setJoiningDate(joiningDate);

        dto.setSchoolId(schoolId);

        // 🔥 CHANGED
        dto.setSchoolAdminId(
                schoolAdminId
        );

        dto.setAssignments(

                Arrays.asList(

                        mapper.readValue(
                                assignmentsJson,
                                ProfessorDTO.AssignmentDTO[].class
                        )
                )
        );

        return professorService
                .updateProfessor(
                        id,
                        dto,
                        image
                );
    }
}