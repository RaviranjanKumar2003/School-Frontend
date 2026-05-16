//package com.example.stud_erp.service.Implementation;
//
//import com.example.stud_erp.entity.*;
//import com.example.stud_erp.payload.LoginRequest;
//import com.example.stud_erp.payload.ProfessorDTO;
//import com.example.stud_erp.repository.*;
//import com.example.stud_erp.service.ImageService;
//import com.example.stud_erp.service.ProfessorService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.UUID;
//
//@Service
//public class ProfessorServiceImpl implements ProfessorService {
//
//    @Autowired
//    private ProfessorRepository professorRepository;
//
//    @Autowired
//    private SchoolRepository schoolRepository;
//
//    @Autowired
//    private HODRepository hodRepository;
//
//    @Autowired
//    private ImageService imageService;
//
//    // ================= CREATE =================
//    @Override
//    public Professor createProfessor(ProfessorDTO dto, MultipartFile image) throws IOException {
//        return saveProfessor(new Professor(), dto, image);
//    }
//
//    // ================= UPDATE =================
//    @Override
//    public Professor updateProfessor(Long id, ProfessorDTO dto, MultipartFile image) throws IOException {
//
//        Professor professor = professorRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Professor not found"));
//
//        // ================= BASIC UPDATE (ALWAYS) =================
//        professor.setName(dto.getName());
//        professor.setEmail(dto.getEmail());
//        professor.setPhone(dto.getPhone());
//        professor.setDesignation(dto.getDesignation());
//        professor.setQualification(dto.getQualification());
//        professor.setExperience(dto.getExperience());
//        professor.setJoiningDate(dto.getJoiningDate());
//
//        School school = schoolRepository.findById(dto.getSchoolId())
//                .orElseThrow(() -> new RuntimeException("School not found"));
//        professor.setSchool(school);
//
//        HOD hod = hodRepository.findById(dto.getHodId())
//                .orElseThrow(() -> new RuntimeException("HOD not found"));
//        professor.setHod(hod);
//
//        // ================= IMAGE =================
//        if (image != null && !image.isEmpty()) {
//            professor.setImageUrl(imageService.uploadImage(image));
//        }
//
//        // ================= ⭐ CONDITIONAL ASSIGNMENT UPDATE =================
//        if (Boolean.TRUE.equals(dto.getUpdateAssignments())) {
//
//            if (professor.getAssignments() == null) {
//                professor.setAssignments(new ArrayList<>());
//            } else {
//                professor.getAssignments().clear();
//            }
//
//            if (dto.getAssignments() != null) {
//                dto.getAssignments().forEach(a -> {
//
//                    TeacherAssignment ta = new TeacherAssignment();
//                    ta.setClassId(a.getClassId());
//                    ta.setClassName(a.getClassName());
//                    ta.setSubjectName(a.getSubjectName());
//                    ta.setProfessor(professor);
//
//                    professor.getAssignments().add(ta);
//                });
//            }
//        }
//
//        return professorRepository.save(professor);
//    }
//
//    // ================= SAVE COMMON =================
//    private Professor saveProfessor(Professor professor, ProfessorDTO dto, MultipartFile image) throws IOException {
//
//        professor.setName(dto.getName());
//        professor.setEmail(dto.getEmail());
//        professor.setPhone(dto.getPhone());
//        professor.setDesignation(dto.getDesignation());
//        professor.setQualification(dto.getQualification());
//        professor.setExperience(dto.getExperience());
//        professor.setJoiningDate(dto.getJoiningDate());
//
//        School school = schoolRepository.findById(dto.getSchoolId())
//                .orElseThrow(() -> new RuntimeException("School not found"));
//        professor.setSchool(school);
//
//        HOD hod = hodRepository.findById(dto.getHodId())
//                .orElseThrow(() -> new RuntimeException("HOD not found"));
//        professor.setHod(hod);
//
//        // ================= USER CREATION =================
//        if (professor.getId() == null) {
//            professor.setUsername(dto.getName().toLowerCase().replaceAll(" ", ""));
//            professor.setPassword(UUID.randomUUID().toString().substring(0, 8));
//        }
//
//        // ================= IMAGE =================
//        if (image != null && !image.isEmpty()) {
//            professor.setImageUrl(imageService.uploadImage(image));
//        }
//
//        // ================= ASSIGNMENTS =================
//        List<TeacherAssignment> list = new ArrayList<>();
//
//        if (dto.getAssignments() != null) {
//            dto.getAssignments().forEach(a -> {
//                TeacherAssignment ta = new TeacherAssignment();
//                ta.setClassId(a.getClassId());
//                ta.setClassName(a.getClassName());
//                ta.setSubjectName(a.getSubjectName());
//                ta.setProfessor(professor);
//                list.add(ta);
//            });
//        }
//
//        professor.setAssignments(list);
//
//        return professorRepository.save(professor);
//    }
//
//    // ================= GET ALL =================
//    @Override
//    public List<Professor> getAllProfessors() {
//        return professorRepository.findAll();
//    }
//
//    // ================= FILTER - SCHOOL =================
//    @Override
//    public List<Professor> getBySchoolId(Long schoolId) {
//        return professorRepository.findBySchool_Id(schoolId);
//    }
//
//    // ================= FILTER - SCHOOL + HOD =================
//    @Override
//    public List<Professor> getBySchoolIdAndHodId(Long schoolId, Long hodId) {
//        return professorRepository.findBySchool_IdAndHod_Id(schoolId, hodId);
//    }
//
//    public List<ProfessorDTO> getBySchoolIdAndHodIdDTO(Long schoolId, Long hodId) {
//
//        List<Professor> list =
//                professorRepository.findBySchool_IdAndHod_Id(schoolId, hodId);
//
//        return list.stream().map(p -> {
//            ProfessorDTO dto = new ProfessorDTO();
//            dto.setName(p.getName());
//            dto.setEmail(p.getEmail());
//            dto.setPhone(p.getPhone());
//            dto.setDesignation(p.getDesignation());
//            dto.setQualification(p.getQualification());
//            dto.setExperience(p.getExperience());
//            dto.setJoiningDate(p.getJoiningDate());
//            dto.setId(p.getId());
//            dto.setAssignments(
//                    p.getAssignments().stream().map(a -> {
//                        ProfessorDTO.AssignmentDTO ad = new ProfessorDTO.AssignmentDTO();
//                        ad.setClassId(a.getClassId());
//                        ad.setClassName(a.getClassName());
//                        ad.setSubjectName(a.getSubjectName());
//                        return ad;
//                    }).toList()
//            );
//            return dto;
//        }).toList();
//    }
//
//    // ================= BY ID =================
//    @Override
//    public Professor getProfessorById(Long id) {
//        return professorRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Professor not found"));
//    }
//
//    // ================= DELETE =================
//    @Override
//    public void deleteProfessor(Long id) {
//        professorRepository.deleteById(id);
//    }
//
//    // ================= SAVE =================
//    @Override
//    public Professor saveProfessor(Professor professor) {
//        return professorRepository.save(professor);
//    }
//
//    // ================= LOGIN (FIXED) =================
//    @Override
//    public Professor authenticateUser(LoginRequest request) {
//
//        Professor prof = professorRepository.findByUsername(request.getUsername())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (!prof.getPassword().equals(request.getPassword())) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        return prof;
//    }
//
//
//    @Override
//    public Professor updateProfessorBasic(Long id, ProfessorDTO dto, MultipartFile image) throws Exception {
//
//        Professor professor = professorRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Professor not found"));
//
//        // ================= BASIC FIELDS =================
//        professor.setName(dto.getName());
//        professor.setEmail(dto.getEmail());
//        professor.setPhone(dto.getPhone());
//        professor.setDesignation(dto.getDesignation());
//        professor.setQualification(dto.getQualification());
//        professor.setExperience(dto.getExperience());
//        professor.setJoiningDate(dto.getJoiningDate());
//
//        // ================= SCHOOL =================
//        if (dto.getSchoolId() != null) {
//            School school = schoolRepository.findById(dto.getSchoolId())
//                    .orElseThrow(() -> new RuntimeException("School not found"));
//
//            professor.setSchool(school);
//        }
//
//        // ================= HOD =================
//        if (dto.getHodId() != null) {
//            HOD hod = hodRepository.findById(dto.getHodId())
//                    .orElseThrow(() -> new RuntimeException("HOD not found"));
//
//            professor.setHod(hod);
//        }
//
//        // ================= IMAGE FIX (IMPORTANT) =================
//        if (image != null && !image.isEmpty()) {
//
//            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
//
//            Path uploadPath = Paths.get("uploads/");
//
//            if (!Files.exists(uploadPath)) {
//                Files.createDirectories(uploadPath);
//            }
//
//            Path filePath = uploadPath.resolve(fileName);
//
//            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//            // 👉 SAVE URL (NOT BYTES)
//            String imageUrl = "http://localhost:8080/uploads/" + fileName;
//
//            professor.setImageUrl(imageUrl);
//        }
//
//        return professorRepository.save(professor);
//    }
//
//}


package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.*;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ProfessorDTO;
import com.example.stud_erp.repository.*;
import com.example.stud_erp.service.ImageService;
import com.example.stud_erp.service.ProfessorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private SchoolAdminRepository schoolAdminRepository;

    @Autowired
    private ImageService imageService;

    // ================= CREATE =================
    @Override
    public Professor createProfessor(
            ProfessorDTO dto,
            MultipartFile image
    ) throws IOException {

        return saveProfessor(
                new Professor(),
                dto,
                image
        );
    }

    // ================= UPDATE =================
    @Override
    public Professor updateProfessor(
            Long id,
            ProfessorDTO dto,
            MultipartFile image
    ) throws IOException {

        Professor professor =
                professorRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Professor not found"
                                )
                        );

        // ================= BASIC UPDATE =================
        professor.setName(dto.getName());
        professor.setEmail(dto.getEmail());
        professor.setPhone(dto.getPhone());
        professor.setDesignation(dto.getDesignation());
        professor.setQualification(dto.getQualification());
        professor.setExperience(dto.getExperience());
        professor.setJoiningDate(dto.getJoiningDate());

        // ================= SCHOOL =================
        School school =
                schoolRepository.findById(dto.getSchoolId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "School not found"
                                )
                        );

        professor.setSchool(school);

        // ================= SCHOOL ADMIN =================
        SchoolAdmin schoolAdmin =
                schoolAdminRepository
                        .findById(dto.getSchoolAdminId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "School Admin not found"
                                )
                        );

        professor.setSchoolAdmin(schoolAdmin);

        // ================= IMAGE =================
        if (image != null && !image.isEmpty()) {

            professor.setImageUrl(
                    imageService.uploadImage(image)
            );
        }

        // ================= ASSIGNMENT UPDATE =================
        if (Boolean.TRUE.equals(dto.getUpdateAssignments())) {

            if (professor.getAssignments() == null) {

                professor.setAssignments(
                        new ArrayList<>()
                );

            } else {

                professor.getAssignments().clear();
            }

            if (dto.getAssignments() != null) {

                dto.getAssignments().forEach(a -> {

                    TeacherAssignment ta =
                            new TeacherAssignment();

                    ta.setClassId(a.getClassId());

                    ta.setClassName(a.getClassName());

                    ta.setSubjectName(a.getSubjectName());

                    ta.setProfessor(professor);

                    professor.getAssignments().add(ta);
                });
            }
        }

        return professorRepository.save(professor);
    }

    // ================= COMMON SAVE =================
    private Professor saveProfessor(
            Professor professor,
            ProfessorDTO dto,
            MultipartFile image
    ) throws IOException {

        professor.setName(dto.getName());

        professor.setEmail(dto.getEmail());

        professor.setPhone(dto.getPhone());

        professor.setDesignation(dto.getDesignation());

        professor.setQualification(dto.getQualification());

        professor.setExperience(dto.getExperience());

        professor.setJoiningDate(dto.getJoiningDate());

        // ================= SCHOOL =================
        School school =
                schoolRepository.findById(dto.getSchoolId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "School not found"
                                )
                        );

        professor.setSchool(school);

        // ================= SCHOOL ADMIN =================
        SchoolAdmin schoolAdmin =
                schoolAdminRepository
                        .findById(dto.getSchoolAdminId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "School Admin not found"
                                )
                        );

        professor.setSchoolAdmin(schoolAdmin);

        // ================= USERNAME PASSWORD =================
        if (professor.getId() == null) {

            professor.setUsername(
                    dto.getName()
                            .toLowerCase()
                            .replaceAll(" ", "")
            );

            professor.setPassword(
                    UUID.randomUUID()
                            .toString()
                            .substring(0, 8)
            );
        }

        // ================= IMAGE =================
        if (image != null && !image.isEmpty()) {

            professor.setImageUrl(
                    imageService.uploadImage(image)
            );
        }

        // ================= ASSIGNMENTS =================
        List<TeacherAssignment> list =
                new ArrayList<>();

        if (dto.getAssignments() != null) {

            dto.getAssignments().forEach(a -> {

                TeacherAssignment ta =
                        new TeacherAssignment();

                ta.setClassId(a.getClassId());

                ta.setClassName(a.getClassName());

                ta.setSubjectName(a.getSubjectName());

                ta.setProfessor(professor);

                list.add(ta);
            });
        }

        professor.setAssignments(list);

        return professorRepository.save(professor);
    }

    // ================= GET ALL =================
    @Override
    public List<Professor> getAllProfessors() {

        return professorRepository.findAll();
    }

    // ================= FILTER - SCHOOL =================
    @Override
    public List<Professor> getBySchoolId(
            Long schoolId
    ) {

        return professorRepository
                .findBySchool_Id(schoolId);
    }

    // ================= FILTER - SCHOOL + SCHOOL ADMIN =================
    @Override
    public List<Professor> getBySchoolIdAndSchoolAdminId(
            Long schoolId,
            Long schoolAdminId
    ) {

        return professorRepository
                .findBySchool_IdAndSchoolAdmin_Id(
                        schoolId,
                        schoolAdminId
                );
    }

    // ================= DTO FILTER =================
    @Override
    public List<ProfessorDTO> getBySchoolIdAndSchoolAdminIdDTO(
            Long schoolId,
            Long schoolAdminId
    ) {

        List<Professor> list =
                professorRepository
                        .findBySchool_IdAndSchoolAdmin_Id(
                                schoolId,
                                schoolAdminId
                        );

        return list.stream().map(p -> {

            ProfessorDTO dto =
                    new ProfessorDTO();

            dto.setId(p.getId());

            dto.setName(p.getName());

            dto.setEmail(p.getEmail());

            dto.setPhone(p.getPhone());

            dto.setDesignation(p.getDesignation());

            dto.setQualification(
                    p.getQualification()
            );

            dto.setExperience(
                    p.getExperience()
            );

            dto.setJoiningDate(
                    p.getJoiningDate()
            );

            // 🔥 IMPORTANT
            dto.setSchoolId(
                    p.getSchool() != null
                            ? p.getSchool().getId()
                            : null
            );

            dto.setSchoolAdminId(
                    p.getSchoolAdmin() != null
                            ? p.getSchoolAdmin().getId()
                            : null
            );

            dto.setAssignments(

                    p.getAssignments()
                            .stream()
                            .map(a -> {

                                ProfessorDTO.AssignmentDTO ad =
                                        new ProfessorDTO.AssignmentDTO();

                                ad.setClassId(a.getClassId());

                                ad.setClassName(a.getClassName());

                                ad.setSubjectName(a.getSubjectName());

                                return ad;

                            }).toList()
            );

            return dto;

        }).toList();
    }

    // ================= GET BY ID =================
    @Override
    public Professor getProfessorById(Long id) {

        return professorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Professor not found"
                        )
                );
    }

    // ================= DELETE =================
    @Override
    public void deleteProfessor(Long id) {

        professorRepository.deleteById(id);
    }

    // ================= SAVE =================
    @Override
    public Professor saveProfessor(
            Professor professor
    ) {

        return professorRepository.save(professor);
    }

    // ================= LOGIN =================
    @Override
    public Professor authenticateUser(
            LoginRequest request
    ) {

        Professor prof =
                professorRepository
                        .findByUsername(
                                request.getUsername()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (!prof.getPassword().equals(
                request.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid password"
            );
        }

        return prof;
    }

    // ================= BASIC UPDATE =================
    @Override
    public Professor updateProfessorBasic(
            Long id,
            ProfessorDTO dto,
            MultipartFile image
    ) throws Exception {

        Professor professor =
                professorRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Professor not found"
                                )
                        );

        // ================= BASIC =================
        professor.setName(dto.getName());

        professor.setEmail(dto.getEmail());

        professor.setPhone(dto.getPhone());

        professor.setDesignation(dto.getDesignation());

        professor.setQualification(
                dto.getQualification()
        );

        professor.setExperience(
                dto.getExperience()
        );

        professor.setJoiningDate(
                dto.getJoiningDate()
        );

        // ================= SCHOOL =================
        if (dto.getSchoolId() != null) {

            School school =
                    schoolRepository
                            .findById(dto.getSchoolId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "School not found"
                                    )
                            );

            professor.setSchool(school);
        }

        // ================= SCHOOL ADMIN =================
        if (dto.getSchoolAdminId() != null) {

            SchoolAdmin schoolAdmin =
                    schoolAdminRepository
                            .findById(
                                    dto.getSchoolAdminId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "School Admin not found"
                                    )
                            );

            professor.setSchoolAdmin(
                    schoolAdmin
            );
        }

        // ================= IMAGE =================
        if (image != null && !image.isEmpty()) {

            String fileName =
                    System.currentTimeMillis()
                            + "_"
                            + image.getOriginalFilename();

            Path uploadPath =
                    Paths.get("uploads/");

            if (!Files.exists(uploadPath)) {

                Files.createDirectories(
                        uploadPath
                );
            }

            Path filePath =
                    uploadPath.resolve(fileName);

            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            String imageUrl =
                    "http://localhost:8080/uploads/"
                            + fileName;

            professor.setImageUrl(imageUrl);
        }

        return professorRepository.save(professor);
    }
}