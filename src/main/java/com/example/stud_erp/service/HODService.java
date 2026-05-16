package com.example.stud_erp.service;

import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.payload.HODDto;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface HODService {

    // ================= CRUD =================
    HOD createHOD(HODDto request, MultipartFile file) throws IOException;

    HOD updateHOD(Long id, HODDto request, MultipartFile file) throws IOException;

    HOD saveHOD(HOD hod);

    List<HOD> getAllHODs();

    HOD getHODById(Long id);

    void deleteHOD(Long id);

    // ================= LOGIN =================
    HOD authenticateUser(LoginRequest loginRequest);

    // ================= OTP =================
    void sendForgotPasswordEmail(String email);

    void verifyOTP(String email, String otp);

    void resetPassword(ResetPasswordRequest request);

    List<HOD> getHODsBySchool(Long schoolId);

}