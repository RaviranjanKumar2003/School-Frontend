package com.example.stud_erp.utils;


import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.IOException;

import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;

public class QRCodeGenerator {

    public static void generateQRCode(

            String text,

            String filePath

    ) {

        try {

            // ================= CREATE DIRECTORY =================

            Path path = Path.of(filePath);

            Files.createDirectories(
                    path.getParent()
            );

            // ================= QR WRITER =================

            QRCodeWriter qrCodeWriter =
                    new QRCodeWriter();

            BitMatrix bitMatrix =
                    qrCodeWriter.encode(
                            text,
                            BarcodeFormat.QR_CODE,
                            300,
                            300
                    );

            // ================= SAVE IMAGE =================

            Path qrPath =
                    FileSystems.getDefault()
                            .getPath(filePath);

            MatrixToImageWriter.writeToPath(
                    bitMatrix,
                    "PNG",
                    qrPath
            );

        } catch (

                WriterException |
                IOException e

        ) {

            throw new RuntimeException(
                    "Failed to generate QR Code",
                    e
            );
        }
    }
}