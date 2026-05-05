package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.Professor;
import com.example.stud_erp.entity.TeacherAssignment;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ProfessorDTO;
import com.example.stud_erp.repository.ProfessorRepository;
import com.example.stud_erp.service.ProfessorService;
import com.example.stud_erp.service.ImageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private ImageService imageService;

    // ================= CREATE =================
    @Override
    public Professor createProfessor(ProfessorDTO dto, MultipartFile image) {

        Professor professor = new Professor();

        return saveProfessor(professor, dto, image);
    }

    // ================= UPDATE =================
    @Override
    public Professor updateProfessor(Long id, ProfessorDTO dto, MultipartFile image) {

        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        // 🔥 clear old assignments
        professor.getAssignments().clear();

        return saveProfessor(professor, dto, image);
    }

    // ================= COMMON SAVE LOGIC =================
    private Professor saveProfessor(Professor professor, ProfessorDTO dto, MultipartFile image) {

        professor.setName(dto.getName());
        professor.setEmail(dto.getEmail());
        professor.setPhone(dto.getPhone());
        professor.setDesignation(dto.getDesignation());
        professor.setQualification(dto.getQualification());
        professor.setExperience(dto.getExperience());
        professor.setJoiningDate(dto.getJoiningDate());

        // username/password only for create
        if (professor.getId() == null) {
            String username = dto.getName().toLowerCase().replaceAll(" ", "");
            String password = UUID.randomUUID().toString().substring(0, 8);

            professor.setUsername(username);
            professor.setPassword(password);
        }

        // IMAGE
        if (image != null && !image.isEmpty()) {
            try {
                professor.setImageUrl(imageService.uploadImage(image));
            } catch (Exception e) {
                throw new RuntimeException("Image upload failed");
            }
        }

        // ASSIGNMENTS
        List<TeacherAssignment> list = new ArrayList<>();

        if (dto.getAssignments() != null) {
            dto.getAssignments().forEach(a -> {

                TeacherAssignment ta = new TeacherAssignment();
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

    // ================= GET BY ID =================
    @Override
    public Professor getProfessorById(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found"));
    }

    // ================= DELETE =================
    @Override
    public void deleteProfessor(Long id) {
        professorRepository.deleteById(id);
    }


    @Override
    public Professor saveProfessor(Professor professor) {
        return professorRepository.save(professor);
    }

    @Override
    public Professor authenticateUser(LoginRequest request) {

        Professor prof = professorRepository
                .findByUsernameAndPassword(
                        request.getUsername(),
                        request.getPassword()
                );

        if (prof == null) {
            throw new RuntimeException("Invalid username or password");
        }

        return prof;
    }

}