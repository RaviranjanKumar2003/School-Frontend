package com.example.stud_erp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${project.image}")
    private String path;

    // ✅ UPLOAD IMAGE
    public String uploadImage(MultipartFile file) throws IOException {

        String originalName = file.getOriginalFilename();

        String randomId = UUID.randomUUID().toString();
        String fileName = randomId.concat(
                originalName.substring(originalName.lastIndexOf("."))
        );

        File folder = new File(path);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        Files.copy(file.getInputStream(), Paths.get(path + File.separator + fileName));

        return fileName;
    }

    // ✅ GET IMAGE
    public InputStream getResource(String fileName) throws FileNotFoundException {
        return new FileInputStream(path + File.separator + fileName);
    }

    // ✅ DELETE IMAGE
    public void deleteImage(String fileName) {
        File file = new File(path + File.separator + fileName);
        if (file.exists()) {
            file.delete();
        }
    }
}