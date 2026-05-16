//package com.example.stud_erp.exception;
//
//import org.springframework.dao.DataIntegrityViolationException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.sql.SQLIntegrityConstraintViolationException;
//
//@ControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(DataIntegrityViolationException.class)
//    public ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
//
//        String message = "❌ Something went wrong";
//
//        Throwable rootCause = ex.getRootCause();
//
//        String rootMessage = (rootCause != null)
//                ? rootCause.getMessage()
//                : ex.getMessage();
//
//        if (rootMessage != null) {
//
//            if (rootMessage.contains("username")) {
//                message = "❌ Username is already taken";
//            }
//            else if (rootMessage.contains("email")) {
//                message = "❌ Email is already registered";
//            }
//            else if (rootMessage.contains("Duplicate entry")) {
//                message = "❌ Marks already submitted for this subject";
//            }
//        }
//
//        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
//    }
//
//    @ExceptionHandler(OTPExpiredException.class)
//    public ResponseEntity<String> handleOTPExpiredException(OTPExpiredException ex) {
//        return ResponseEntity
//                .status(HttpStatus.BAD_REQUEST)
//                .body("❌ OTP has expired");
//    }
//
//    // OPTIONAL (safe fallback)
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleAll(Exception ex) {
//        return ResponseEntity
//                .status(HttpStatus.BAD_REQUEST)
//                .body("❌ " + ex.getMessage());
//    }
//}



package com.example.stud_erp.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // =========================================================
    // DATA INTEGRITY / DUPLICATE ERRORS
    // =========================================================

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex
    ) {

        String message = "❌ Duplicate or invalid data found";

        Throwable rootCause = ex.getRootCause();

        String rootMessage =
                (rootCause != null)
                        ? rootCause.getMessage()
                        : ex.getMessage();

        System.out.println("ROOT ERROR : " + rootMessage);

        if (rootMessage != null) {

            // ================= USERNAME =================

            if (
                    rootMessage.toLowerCase().contains("username")
            ) {

                message =
                        "❌ Username is already taken";
            }

            // ================= EMAIL =================

            else if (
                    rootMessage.toLowerCase().contains("email")
            ) {

                message =
                        "❌ Email is already registered";
            }

            // ================= STUDENT ID =================

            else if (
                    rootMessage.toLowerCase().contains("student_id")
            ) {

                message =
                        "❌ Student ID already exists";
            }

            // ================= ADMISSION NUMBER =================

            else if (
                    rootMessage.toLowerCase()
                            .contains("admission_number")
            ) {

                message =
                        "❌ Admission number already exists";
            }

            // ================= DUPLICATE ENTRY =================

            else if (
                    rootMessage.toLowerCase()
                            .contains("duplicate entry")
            ) {

                message =
                        "❌ Duplicate entry found in database";
            }

            // ================= SHOW ORIGINAL =================

            else {

                message = "❌ " + rootMessage;
            }
        }

        return new ResponseEntity<>(
                message,
                HttpStatus.CONFLICT
        );
    }

    // =========================================================
    // OTP EXPIRED
    // =========================================================

    @ExceptionHandler(OTPExpiredException.class)
    public ResponseEntity<String> handleOTPExpiredException(
            OTPExpiredException ex
    ) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("❌ OTP has expired");
    }

    // =========================================================
    // GENERAL EXCEPTION
    // =========================================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAll(
            Exception ex
    ) {

        ex.printStackTrace();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("❌ " + ex.getMessage());
    }
}