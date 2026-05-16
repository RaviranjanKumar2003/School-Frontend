package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.entity.School;
import com.example.stud_erp.payload.HODDto;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.repository.HODRepository;
import com.example.stud_erp.repository.SchoolRepository;
import com.example.stud_erp.service.EmailService;
import com.example.stud_erp.service.HODService;
import com.example.stud_erp.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class HODServiceImpl implements HODService {

    private final HODRepository hodRepository;
    private final SchoolRepository schoolRepository;
    private final ImageService imageService;
    private final EmailService emailService;

    public HODServiceImpl(
            HODRepository hodRepository,
            SchoolRepository schoolRepository,
            ImageService imageService,
            EmailService emailService
    ) {
        this.hodRepository = hodRepository;
        this.schoolRepository = schoolRepository;
        this.imageService = imageService;
        this.emailService = emailService;
    }

    // ================= CREATE =================
    @Override
    public HOD createHOD(
            HODDto request,
            MultipartFile file
    ) throws IOException {

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new RuntimeException("School not found"));

        HOD hod = new HOD();

        hod.setName(request.getName());
        hod.setDepartment(request.getDepartment());
        hod.setUsername(request.getUsername());
        hod.setPassword(request.getPassword());
        hod.setEmail(request.getEmail());
        hod.setPhone(request.getPhone());

        // SCHOOL
        hod.setSchool(school);

        // IMAGE
        if (file != null && !file.isEmpty()) {

            String imageUrl =
                    imageService.uploadImage(file);

            hod.setImageUrl(imageUrl);
        }

        hod.setCreatedAt(LocalDateTime.now());
        hod.setUpdatedAt(LocalDateTime.now());

        return hodRepository.save(hod);
    }

    // ================= UPDATE =================
    @Override
    public HOD updateHOD(
            Long id,
            HODDto request,
            MultipartFile file
    ) throws IOException {

        HOD existingHOD = hodRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("HOD not found"));

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new RuntimeException("School not found"));

        existingHOD.setName(request.getName());
        existingHOD.setDepartment(request.getDepartment());
        existingHOD.setUsername(request.getUsername());
        existingHOD.setPassword(request.getPassword());
        existingHOD.setEmail(request.getEmail());
        existingHOD.setPhone(request.getPhone());

        // SCHOOL
        existingHOD.setSchool(school);

        // IMAGE UPDATE
        if (file != null && !file.isEmpty()) {

            if (existingHOD.getImageUrl() != null) {

                imageService.deleteImage(
                        existingHOD.getImageUrl()
                );
            }

            String imageUrl =
                    imageService.uploadImage(file);

            existingHOD.setImageUrl(imageUrl);
        }

        existingHOD.setUpdatedAt(LocalDateTime.now());

        return hodRepository.save(existingHOD);
    }

    // ================= SAVE =================
    @Override
    public HOD saveHOD(HOD hod) {
        return hodRepository.save(hod);
    }

    // ================= GET ALL =================
    @Override
    public List<HOD> getAllHODs() {
        return hodRepository.findAll();
    }

    // ================= GET BY ID =================
    @Override
    public HOD getHODById(Long id) {
        return hodRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("HOD not found"));
    }

    // ================= DELETE =================
    @Override
    public void deleteHOD(Long id) {

        HOD hod = getHODById(id);

        if (hod.getImageUrl() != null) {
            imageService.deleteImage(hod.getImageUrl());
        }

        hodRepository.delete(hod);
    }

    // ================= LOGIN =================
    @Override
    public HOD authenticateUser(LoginRequest loginRequest) {

        HOD user = hodRepository.findByUsername(
                loginRequest.getUsername()
        );

        if (user == null ||
                !loginRequest.getPassword()
                        .equals(user.getPassword())) {

            throw new RuntimeException(
                    "Invalid username or password"
            );
        }

        return user;
    }

    // ================= SEND OTP =================
    @Override
    public void sendForgotPasswordEmail(String email) {

        HOD user = hodRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String otp = generateOTP();

        user.setOtp(otp);

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        hodRepository.save(user);

        emailService.sendOtpEmail(
                user.getEmail(),
                otp
        );
    }

    // ================= VERIFY OTP =================
    @Override
    public void verifyOTP(
            String email,
            String otp
    ) {

        HOD user = hodRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (user.getOtpExpiry() != null &&
                user.getOtpExpiry()
                        .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("OTP expired");
        }

        if (!otp.equals(user.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }
    }

    // ================= RESET PASSWORD =================
    @Override
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        HOD hod = hodRepository.findByEmail(
                request.getEmail()
        );

        if (hod == null) {
            throw new RuntimeException("User not found");
        }

        hod.setPassword(request.getNewPassword());

        hod.setOtp(null);
        hod.setOtpExpiry(null);

        hodRepository.save(hod);
    }

    // ================= OTP GENERATOR =================
    private String generateOTP() {

        return String.valueOf(
                100000 +
                        new Random().nextInt(900000)
        );
    }


    @Override
    public List<HOD> getHODsBySchool(Long schoolId) {

        return hodRepository.findBySchoolId(schoolId);
    }


}