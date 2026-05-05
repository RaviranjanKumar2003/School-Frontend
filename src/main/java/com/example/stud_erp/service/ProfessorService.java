package com.example.stud_erp.service;

import com.example.stud_erp.entity.Professor;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ProfessorDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProfessorService {

    // ================= CREATE =================
    Professor createProfessor(ProfessorDTO dto, MultipartFile image);

    // ================= READ =================
    List<Professor> getAllProfessors();

    Professor getProfessorById(Long id);

    // ================= UPDATE =================
    Professor updateProfessor(Long id, ProfessorDTO dto, MultipartFile image);

    // ================= DELETE =================
    void deleteProfessor(Long id);

    Professor saveProfessor(Professor professor);

    Professor authenticateUser(LoginRequest request);
}