package com.example.stud_erp.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {

        String message = "❌ Something went wrong";

        Throwable rootCause = ex.getRootCause();

        String rootMessage = (rootCause != null)
                ? rootCause.getMessage()
                : ex.getMessage();

        if (rootMessage != null) {

            if (rootMessage.contains("username")) {
                message = "❌ Username is already taken";
            }
            else if (rootMessage.contains("email")) {
                message = "❌ Email is already registered";
            }
            else if (rootMessage.contains("Duplicate entry")) {
                message = "❌ Marks already submitted for this subject";
            }
        }

        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(OTPExpiredException.class)
    public ResponseEntity<String> handleOTPExpiredException(OTPExpiredException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("❌ OTP has expired");
    }

    // OPTIONAL (safe fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAll(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("❌ " + ex.getMessage());
    }
}