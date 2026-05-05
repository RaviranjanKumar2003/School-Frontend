package com.example.stud_erp.controller;

import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.exception.OTPExpiredException;
import com.example.stud_erp.payload.ForgotPasswordRequest;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.service.HODService;
import com.example.stud_erp.service.ImageService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/hods")
public class HODController {

    @Value("${project.image}")
    private String path;

    @Autowired
    private HODService hodService;

    @Autowired
    private ImageService imageService;

    // ================== ADD HOD ==================
    @PostMapping("/add-hod")
    public ResponseEntity<String> createHOD(
            @RequestParam("file") MultipartFile multipartFile,
            @RequestParam("name") String name,
            @RequestParam("department") String department,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone
    ) {
        try {
            HOD hod = new HOD();

            hod.setName(name);
            hod.setDepartment(department);
            hod.setUsername(username);
            hod.setPassword(password);
            hod.setEmail(email);
            hod.setPhone(phone);

            // ✅ upload image
            String imageUrl = imageService.uploadImage(multipartFile);
            hod.setImageUrl(imageUrl);

            hod.setCreatedAt(LocalDateTime.now());
            hod.setUpdatedAt(LocalDateTime.now());

            hodService.saveHOD(hod);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("HOD data successfully uploaded");

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username or Email already exists");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading HOD data");
        }
    }

    // ================== UPDATE HOD ==================
    @PutMapping("/update-hod/{id}")
    public ResponseEntity<String> updateHOD(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile multipartFile,
            @RequestParam("name") String name,
            @RequestParam("department") String department,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone
    ) {
        try {
            HOD existingHOD = hodService.getHODById(id);

            if (existingHOD == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("HOD not found");
            }

            existingHOD.setName(name);
            existingHOD.setDepartment(department);
            existingHOD.setUsername(username);
            existingHOD.setPassword(password);
            existingHOD.setEmail(email);
            existingHOD.setPhone(phone);

            // ✅ update image
            if (multipartFile != null && !multipartFile.isEmpty()) {

                if (existingHOD.getImageUrl() != null) {
                    imageService.deleteImage(existingHOD.getImageUrl());
                }

                String imageUrl = imageService.uploadImage(multipartFile);
                existingHOD.setImageUrl(imageUrl);
            }

            existingHOD.setUpdatedAt(LocalDateTime.now());

            hodService.saveHOD(existingHOD);

            return ResponseEntity.ok("HOD updated successfully");

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username or Email already exists");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating HOD");
        }
    }

    // ================== GET ALL ==================
    @GetMapping("/get-hod")
    public ResponseEntity<List<HOD>> getAllHODs() {
        return ResponseEntity.ok(hodService.getAllHODs());
    }

// ================== GET BY ID ==================
    @GetMapping("/{id}")
    public ResponseEntity<HOD> getHODById(@PathVariable Long id) {
        HOD hod = hodService.getHODById(id);
        return hod != null ? ResponseEntity.ok(hod)
                : ResponseEntity.notFound().build();
    }

    // ================== DELETE ==================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHOD(@PathVariable Long id) {
        hodService.deleteHOD(id);
        return ResponseEntity.noContent().build();
    }

    // ================== LOGIN ==================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            return ResponseEntity.ok(hodService.authenticateUser(loginRequest));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Login failed: " + ex.getMessage());
        }
    }

    // ================== FORGOT PASSWORD ==================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            hodService.sendForgotPasswordEmail(request.getEmail());
            return ResponseEntity.ok("OTP sent");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getMessage());
        }
    }

    // ================== VERIFY OTP ==================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestParam String email, @RequestParam String otp) {
        try {
            hodService.verifyOTP(email, otp);
            return ResponseEntity.ok("OTP verified");
        } catch (OTPExpiredException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }
    }

    // ================== RESET PASSWORD ==================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            hodService.resetPassword(request);
            return ResponseEntity.ok("Password reset successful");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getMessage());
        }
    }

//===================================================== IMAGE UPLOAD ===============================================
    @PostMapping("/image/upload/{hodId}")
    public ResponseEntity<HOD> uploadHodImage(
            @RequestParam("image") MultipartFile image,
            @PathVariable Long hodId
    ) throws IOException {

        HOD hod = hodService.getHODById(hodId);

        if (hod == null) {
            throw new RuntimeException("HOD not found");
        }

        if (hod.getImageUrl() != null) {
            imageService.deleteImage(hod.getImageUrl());
        }

        String fileName = imageService.uploadImage(image);
        hod.setImageUrl(fileName);

        return ResponseEntity.ok(hodService.saveHOD(hod));
    }

    // ================== IMAGE GET ==================
    @GetMapping("/image/get/{hodId}")
    public void downloadHodImage(
            @PathVariable Long hodId,
            HttpServletResponse response
    ) throws IOException {

        HOD hod = hodService.getHODById(hodId);

        if (hod == null || hod.getImageUrl() == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("Image not found");
            return;
        }

        String imageName = Paths.get(hod.getImageUrl()).getFileName().toString();

        try (InputStream resource = imageService.getResource(imageName)) {

            String contentType = URLConnection.guessContentTypeFromName(imageName);

            response.setContentType(
                    contentType != null ? contentType : "application/octet-stream"
            );

            StreamUtils.copy(resource, response.getOutputStream());
        }
    }


    @PostMapping("/cover/upload/{hodId}")
    public ResponseEntity<HOD> uploadCoverImage(
            @RequestParam("image") MultipartFile image,
            @PathVariable Long hodId
    ) throws IOException {

        HOD hod = hodService.getHODById(hodId);

        if (hod == null) {
            throw new RuntimeException("HOD not found");
        }

        // old cover delete
        if (hod.getCoverImage() != null) {
            imageService.deleteImage(hod.getCoverImage());
        }

        String fileName = imageService.uploadImage(image);
        hod.setCoverImage(fileName);

        return ResponseEntity.ok(hodService.saveHOD(hod));
    }


    @GetMapping("/cover/get/{hodId}")
    public void downloadCoverImage(
            @PathVariable Long hodId,
            HttpServletResponse response
    ) throws IOException {

        HOD hod = hodService.getHODById(hodId);

        if (hod == null || hod.getCoverImage() == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("Cover image not found");
            return;
        }

        String imageName = Paths.get(hod.getCoverImage()).getFileName().toString();

        try (InputStream resource = imageService.getResource(imageName)) {

            String contentType = URLConnection.guessContentTypeFromName(imageName);

            response.setContentType(
                    contentType != null ? contentType : "application/octet-stream"
            );

            StreamUtils.copy(resource, response.getOutputStream());
        }
    }


}