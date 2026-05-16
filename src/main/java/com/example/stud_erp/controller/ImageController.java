package com.example.stud_erp.controller;

import com.example.stud_erp.service.ImageService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/api/images")
@CrossOrigin("*")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    // ================= GET IMAGE =================
    @GetMapping("/{imageName}")
    public void getImage(
            @PathVariable String imageName,
            HttpServletResponse response
    ) throws IOException {

        InputStream resource =
                imageService.getResource(imageName);

        response.setContentType(
                MediaType.IMAGE_JPEG_VALUE
        );

        StreamUtils.copy(
                resource,
                response.getOutputStream()
        );
    }
}