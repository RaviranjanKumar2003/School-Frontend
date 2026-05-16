//package com.example.stud_erp.service.Implementation;
//
//import com.example.stud_erp.service.ImageService;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.*;
//import java.util.UUID;
//
//@Service
//public class ImageServiceImpl extends ImageService {
//
//    // ================= FOLDER =================
//    private final String UPLOAD_DIR = "uploads/";
//
//    // ================= UPLOAD =================
//    @Override
//    public String uploadImage(
//            MultipartFile file
//    ) throws IOException {
//
//        // CREATE FOLDER IF NOT EXISTS
//        Path uploadPath = Paths.get(UPLOAD_DIR);
//
//        if (!Files.exists(uploadPath)) {
//
//            Files.createDirectories(uploadPath);
//        }
//
//        // UNIQUE FILE NAME
//        String fileName =
//                UUID.randomUUID() +
//                        "_" +
//                        file.getOriginalFilename();
//
//        // FILE PATH
//        Path filePath =
//                uploadPath.resolve(fileName);
//
//        // SAVE FILE
//        Files.copy(
//                file.getInputStream(),
//                filePath,
//                StandardCopyOption.REPLACE_EXISTING
//        );
//
//        // RETURN FILE NAME
//        return fileName;
//    }
//
//    // ================= DELETE =================
//    @Override
//    public void deleteImage(
//            String imageUrl
//    ) {
//
//        try {
//
//            Path path =
//                    Paths.get(
//                            UPLOAD_DIR + imageUrl
//                    );
//
//            Files.deleteIfExists(path);
//
//        } catch (Exception e) {
//
//            e.printStackTrace();
//        }
//    }
//}


package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ImageServiceImpl extends ImageService {

    // ================= FOLDER =================
    private final Path UPLOAD_DIR = Paths.get(
            System.getProperty("user.dir"),
            "uploads",
            "students"
    );

    // ================= UPLOAD =================
    @Override
    public String uploadImage(
            MultipartFile file
    ) throws IOException {

        // CREATE FOLDER IF NOT EXISTS
        if (!Files.exists(UPLOAD_DIR)) {

            Files.createDirectories(UPLOAD_DIR);
        }

        // UNIQUE FILE NAME
        String fileName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        // FILE PATH
        Path filePath =
                UPLOAD_DIR.resolve(fileName);

        // SAVE FILE
        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        System.out.println(
                "IMAGE SAVED AT : "
                        + filePath.toAbsolutePath()
        );

        // RETURN ONLY FILE NAME
        return fileName;
    }

    // ================= DELETE =================
    @Override
    public void deleteImage(
            String imageUrl
    ) {

        try {

            Path path =
                    UPLOAD_DIR.resolve(imageUrl);

            Files.deleteIfExists(path);

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}