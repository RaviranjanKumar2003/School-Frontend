package com.example.stud_erp.controller;

import com.example.stud_erp.entity.SchoolAdmin;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.LoginResponse;
import com.example.stud_erp.service.ImageService;
import com.example.stud_erp.service.SchoolAdminService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/school-admin")
public class SchoolAdminController {

    private final SchoolAdminService service;

    private final ImageService imageService;

    public SchoolAdminController(SchoolAdminService service, ImageService imageService) {
        this.service = service;
        this.imageService = imageService;
    }

    @PostMapping
    public SchoolAdmin create(@RequestBody SchoolAdmin admin) {
        return service.create(admin);
    }

    @PutMapping("/{id}")
    public SchoolAdmin update(@PathVariable Long id,
                              @RequestBody SchoolAdmin admin) {
        return service.update(id, admin);
    }

    @GetMapping("/{id}")
    public SchoolAdmin get(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted";
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return service.login(request.getUsername(), request.getPassword());
    }


// PROFILE IMAGE
    @PostMapping("/image/upload/{adminId}")
    public ResponseEntity<SchoolAdmin> uploadSchoolAdminImage(

            @RequestParam("image")
            MultipartFile image,

            @PathVariable
            Long adminId

    ) throws IOException {

        SchoolAdmin admin =
                service.getById(adminId);

        // OLD IMAGE DELETE
        if (admin.getImageUrl() != null) {

            imageService.deleteImage(
                    admin.getImageUrl()
            );
        }

        // NEW IMAGE UPLOAD
        String fileName =
                imageService.uploadImage(image);

        admin.setImageUrl(fileName);

        return ResponseEntity.ok(
                service.saveSchoolAdmin(admin)
        );
    }

    @GetMapping("/image/get/{adminId}")
    public void getSchoolAdminImage(

            @PathVariable
            Long adminId,

            HttpServletResponse response

    ) throws IOException {

        SchoolAdmin admin =
                service.getById(adminId);

        if (admin.getImageUrl() == null) {

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
                        admin.getImageUrl()
                ).getFileName().toString();

        try (

                InputStream resource =
                        imageService.getResource(imageName)

        ) {

            String contentType =
                    URLConnection.guessContentTypeFromName(
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