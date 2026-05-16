package com.example.stud_erp.controller;

import com.example.stud_erp.entity.HOD;
import com.example.stud_erp.payload.ForgotPasswordRequest;
import com.example.stud_erp.payload.HODDto;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.service.HODService;
import com.example.stud_erp.service.ImageService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/hods")
@CrossOrigin("*")
public class HODController {

    private final HODService hodService;

    private final ImageService imageService;

    public HODController(
            HODService hodService,
            ImageService imageService
    ) {

        this.hodService = hodService;
        this.imageService = imageService;
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<?> createHOD(

            @RequestPart("data")
            HODDto request,

            @RequestPart(
                    value = "file",
                    required = false
            )
            MultipartFile file

    ) {

        try {

            HOD savedHod =
                    hodService.createHOD(
                            request,
                            file
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedHod);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHOD(

            @PathVariable
            Long id,

            @RequestPart("data")
            HODDto request,

            @RequestPart(
                    value = "file",
                    required = false
            )
            MultipartFile file

    ) {

        try {

            HOD updatedHod =
                    hodService.updateHOD(
                            id,
                            request,
                            file
                    );

            return ResponseEntity.ok(
                    updatedHod
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ================= GET ALL =================
    @GetMapping
    public ResponseEntity<List<HOD>>
    getAllHODs() {

        return ResponseEntity.ok(
                hodService.getAllHODs()
        );
    }

    // ================= GET HODS BY SCHOOL =================
    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<HOD>>
    getHODsBySchool(

            @PathVariable
            Long schoolId

    ) {

        return ResponseEntity.ok(
                hodService.getHODsBySchool(
                        schoolId
                )
        );
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<HOD>
    getHODById(

            @PathVariable
            Long id

    ) {

        return ResponseEntity.ok(
                hodService.getHODById(id)
        );
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHOD(

            @PathVariable
            Long id

    ) {

        hodService.deleteHOD(id);

        return ResponseEntity.ok(
                "HOD deleted successfully"
        );
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(

            @Valid
            @RequestBody
            LoginRequest loginRequest

    ) {

        try {

            return ResponseEntity.ok(
                    hodService.authenticateUser(
                            loginRequest
                    )
            );

        } catch (Exception ex) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ex.getMessage());
        }
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(

            @Valid
            @RequestBody
            ForgotPasswordRequest request

    ) {

        try {

            hodService.sendForgotPasswordEmail(
                    request.getEmail()
            );

            return ResponseEntity.ok(
                    "OTP sent successfully"
            );

        } catch (Exception ex) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getMessage());
        }
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(

            @RequestParam
            String email,

            @RequestParam
            String otp

    ) {

        try {

            hodService.verifyOTP(
                    email,
                    otp
            );

            return ResponseEntity.ok(
                    "OTP verified"
            );

        } catch (Exception ex) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ex.getMessage());
        }
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(

            @Valid
            @RequestBody
            ResetPasswordRequest request

    ) {

        try {

            hodService.resetPassword(
                    request
            );

            return ResponseEntity.ok(
                    "Password reset successful"
            );

        } catch (Exception ex) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getMessage());
        }
    }

    // ================= IMAGE UPLOAD =================
    @PostMapping("/image/upload/{hodId}")
    public ResponseEntity<HOD>
    uploadHodImage(

            @RequestParam("image")
            MultipartFile image,

            @PathVariable
            Long hodId

    ) throws IOException {

        HOD hod =
                hodService.getHODById(hodId);

        if (hod.getImageUrl() != null) {

            imageService.deleteImage(
                    hod.getImageUrl()
            );
        }

        String fileName =
                imageService.uploadImage(
                        image
                );

        hod.setImageUrl(fileName);

        return ResponseEntity.ok(
                hodService.saveHOD(hod)
        );
    }

    // ================= GET IMAGE =================
    @GetMapping("/image/get/{hodId}")
    public void downloadHodImage(

            @PathVariable
            Long hodId,

            HttpServletResponse response

    ) throws IOException {

        HOD hod =
                hodService.getHODById(hodId);

        if (hod.getImageUrl() == null) {

            response.setStatus(
                    HttpServletResponse.SC_NOT_FOUND
            );

            response.getWriter().write(
                    "Image not found"
            );

            return;
        }

        String imageName =
                Paths.get(
                        hod.getImageUrl()
                ).getFileName().toString();

        try (

                InputStream resource =
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
                    resource,
                    response.getOutputStream()
            );
        }
    }

}