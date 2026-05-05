package com.example.stud_erp.service;

import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.repository.HODRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class HODService {

    @Autowired
    private HODRepository hodRepository;

    @Autowired
    private EmailService emailService;

    public HOD saveHOD(HOD hod) {
        return hodRepository.save(hod);
    }

    public List<HOD> getAllHODs() {
        return hodRepository.findAll();
    }

    public HOD getHODById(Long id) {
        return hodRepository.findById(id).orElse(null);
    }

    public void deleteHOD(Long id) {
        hodRepository.deleteById(id);
    }

    public HOD updateHOD(Long id, HOD hodDetails) {

        HOD hod = hodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HOD not found"));

        hod.setName(hodDetails.getName());
        hod.setDepartment(hodDetails.getDepartment());
        hod.setUsername(hodDetails.getUsername());
        hod.setPassword(hodDetails.getPassword());
        hod.setEmail(hodDetails.getEmail());
        hod.setPhone(hodDetails.getPhone());
        hod.setSubjects(hodDetails.getSubjects());
        hod.setUpdatedAt(LocalDateTime.now());

        if (hodDetails.getImageUrl() != null) {
            hod.setImageUrl(hodDetails.getImageUrl());
        }

        return hodRepository.save(hod);
    }

    public HOD authenticateUser(LoginRequest loginRequest) {

        HOD user = hodRepository.findByUsername(loginRequest.getUsername());

        if (user == null || !loginRequest.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    public void sendForgotPasswordEmail(String email) {

        HOD user = hodRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String otp = generateOTP();
        user.setOtp(otp);

        hodRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    public void verifyOTP(String email, String otp) {

        HOD user = hodRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!otp.equals(user.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {

        HOD hod = hodRepository.findByEmail(request.getEmail());

        if (hod == null) {
            throw new RuntimeException("User not found");
        }

        hod.setPassword(request.getNewPassword());
        hodRepository.save(hod);
    }

    private String generateOTP() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}