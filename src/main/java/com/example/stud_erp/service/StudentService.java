//package com.example.stud_erp.service;
//
//import com.example.stud_erp.entity.Student;
//import com.example.stud_erp.exception.CustomException;
//import com.example.stud_erp.exception.OTPExpiredException;
//import com.example.stud_erp.payload.LoginRequest;
//import com.example.stud_erp.payload.ResetPasswordRequest;
//import com.example.stud_erp.payload.StudentDTO;
//import com.example.stud_erp.repository.StudentRepository;
//
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.annotation.Cacheable;
//import org.springframework.dao.DataIntegrityViolationException;
//import org.springframework.stereotype.Service;
//
//import java.time.Year;
//import java.util.List;
//import java.util.Optional;
//import java.util.Random;
//import java.util.stream.Collectors;
//
//@Service
//@Transactional
//public class StudentService {
//
//    @Autowired
//    private StudentRepository studentRepository;
//
//    @Autowired
//    private EmailService emailService;
//
//    // ===============================
//    // GET ALL STUDENTS
//    // ===============================
//    @Cacheable("students")
//    public List<StudentDTO> findAll() {
//
//        List<Student> students = studentRepository.findByIsDeletedFalse();
//
//        return students.stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    // ===============================
//    // GET BY CLASS
//    // ===============================
//    public List<StudentDTO> getStudentsByClass(int classNumber) {
//
//        List<Student> students =
//                studentRepository.findByClassNumberAndIsDeletedFalse(classNumber);
//
//        return students.stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    // ===============================
//    // ✅ FIXED CONVERT ENTITY → DTO
//    // ===============================
//    private StudentDTO convertToDTO(Student student) {
//
//        StudentDTO dto = new StudentDTO();
//
//        dto.setId(student.getId());
//        dto.setStudentId(student.getStudentId());
//        dto.setUsername(student.getUsername());
//        dto.setEmail(student.getEmail());
//
//        // ✅ FINAL FIX
//        dto.setClassNumber(student.getClassNumber());
//
//        dto.setStudRollNo(student.getStudRollNo());
//        dto.setStudName(student.getStudName());
//        dto.setStudFatherName(student.getStudFatherName());
//        dto.setStudLastName(student.getStudLastName());
//        dto.setStudPhoneNumber(student.getStudPhoneNumber());
//        dto.setStudentDob(student.getStudentDob());
//        dto.setStudCategory(student.getStudCategory());
//        dto.setStudCaste(student.getStudCaste());
//        dto.setStudentAge(student.getStudentAge());
//        dto.setImageUrl(student.getImageUrl());
//
//        return dto;
//    }
//
//    // ===============================
//    // CREATE STUDENT
//    // ===============================
//    public Student addStudent(Student student) {
//
//        try {
//
//            // ================= DEFAULT SCHOOL CODE =================
//            if (student.getSchoolCode() == null || student.getSchoolCode().isEmpty()) {
//                student.setSchoolCode("SCH");
//            }
//
//            // ================= VALIDATION =================
//            if (student.getStudName() == null || student.getStudName().trim().isEmpty()) {
//                throw new CustomException("Student name required");
//            }
//
//            if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
//                throw new CustomException("Email required");
//            }
//
//            student.setEmail(student.getEmail().trim().toLowerCase());
//
//            if (student.getClassNumber() <= 0) {
//                throw new CustomException("Valid class required");
//            }
//
//            // ================= DUPLICATE EMAIL CHECK =================
//            if (studentRepository.existsByEmail(student.getEmail())) {
//                throw new CustomException("Email already exists");
//            }
//
//            // ================= 🔥 AUTO ROLL NUMBER =================
//            Long lastRoll = studentRepository.findLastRollNumberByClass(student.getClassNumber());
//            Long newRollNo = (lastRoll == null) ? 1 : lastRoll + 1;
//            student.setStudRollNo(newRollNo);
//
//            // ================= REGISTRATION NUMBER =================
//            String registrationNumber =
//                    student.getSchoolCode() + "-" +
//                            Year.now().getValue() + "-" +
//                            String.format("%04d", studentRepository.count() + 1);
//            student.setStudentId(registrationNumber);
//
//            // ================= USERNAME (unique) =================
//            String baseUsername = student.getStudName().toLowerCase().replace(" ", "") + newRollNo;
//            String username = baseUsername;
//            int i = 1;
//            while(studentRepository.existsByUsername(username)) {
//                username = baseUsername + i; // append number if exists
//                i++;
//            }
//            student.setUsername(username);
//
//            // ================= PASSWORD =================
//            String password = generateRandomPassword();
//            student.setPassword(password);
//
//            // ================= SAVE =================
//            return studentRepository.save(student);
//
//        } catch (DataIntegrityViolationException ex) {
//            ex.printStackTrace(); // 🔥 DEBUG
//            throw new CustomException("Duplicate student data (email/username)");
//        } catch (Exception e) {
//            e.printStackTrace(); // 🔥 VERY IMPORTANT
//            throw new RuntimeException("Error while saving student: " + e.getMessage());
//        }
//    }
//
//    private String generateRandomPassword() {
//        Random random = new Random();
//        int number = 1000 + random.nextInt(9000);
//        return "Stu@" + number;
//    }
//
//    public Optional<Student> getByStudentId(String studentId) {
//        return studentRepository.findByStudentId(studentId);
//    }
//
//    public Optional<Student> getById(Long id) {
//        return studentRepository.findById(id);
//    }
//
//    public Student updateStudent(Long id, Student updatedStudent) {
//
//        return studentRepository.findById(id).map(student -> {
//
//            student.setEmail(updatedStudent.getEmail());
//            student.setStudName(updatedStudent.getStudName());
//            student.setStudFatherName(updatedStudent.getStudFatherName());
//            student.setStudLastName(updatedStudent.getStudLastName());
//            student.setStudPhoneNumber(updatedStudent.getStudPhoneNumber());
//            student.setStudentDob(updatedStudent.getStudentDob());
//
//            // ✅ FIX
//            student.setClassNumber(updatedStudent.getClassNumber());
//
//            student.setStudCategory(updatedStudent.getStudCategory());
//            student.setStudCaste(updatedStudent.getStudCaste());
//            student.setStudentAge(updatedStudent.getStudentAge());
//            student.setImageUrl(updatedStudent.getImageUrl());
//
//            return studentRepository.save(student);
//
//        }).orElseThrow(() -> new CustomException("Student not found"));
//    }
//
//    public void deleteStudent(Long id) {
//
//        Student student = studentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        student.setDeleted(true);
//        studentRepository.save(student);
//    }
//
//    public Student authenticateUser(LoginRequest loginRequest) {
//
//        Optional<Student> optionalUser =
//                studentRepository.findByUsername(loginRequest.getUsername());
//
//        if (optionalUser.isEmpty()) {
//            throw new RuntimeException("User not found");
//        }
//
//        Student user = optionalUser.get();
//
//        if (!loginRequest.getPassword().equals(user.getPassword())) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        return user;
//    }
//
//    public void sendForgotPasswordEmail(String email) {
//
//        Optional<Student> optionalUser = studentRepository.findByEmail(email);
//
//        if (optionalUser.isEmpty()) {
//            throw new OTPExpiredException("User not found");
//        }
//
//        Student user = optionalUser.get();
//
//        String otp = generateOTP();
//        user.setOtp(otp);
//
//        studentRepository.save(user);
//
//        emailService.sendOtpEmail(user.getEmail(), otp);
//    }
//
//    private String generateOTP() {
//        Random random = new Random();
//        return String.valueOf(100000 + random.nextInt(900000));
//    }
//
//    public void verifyOTP(String email, String otp) {
//
//        Optional<Student> optionalUser = studentRepository.findByEmail(email);
//
//        if (optionalUser.isEmpty()) {
//            throw new OTPExpiredException("User not found");
//        }
//
//        Student user = optionalUser.get();
//
//        if (!user.getOtp().equals(otp)) {
//            throw new OTPExpiredException("Invalid OTP");
//        }
//    }
//
//    public void resetPassword(ResetPasswordRequest request) {
//
//        Optional<Student> optionalUser =
//                studentRepository.findByEmail(request.getEmail());
//
//        if (optionalUser.isEmpty()) {
//            throw new OTPExpiredException("User not found");
//        }
//
//        Student user = optionalUser.get();
//
//        user.setPassword(request.getNewPassword());
//        studentRepository.save(user);
//    }
//
//
//
//
//    // ✅ GET DELETED STUDENTS
//    public List<StudentDTO> getDeletedStudents() {
//
//        List<Student> students = studentRepository.findByIsDeletedTrue();
//
//        return students.stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//
//    // ✅ RESTORE STUDENT
//    public void restoreStudent(Long id) {
//
//        Student student = studentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        student.setDeleted(false);
//
//        studentRepository.save(student);
//    }
//
//
//    // ❌ PERMANENT DELETE
//    public void deletePermanently(Long id) {
//
//        if (!studentRepository.existsById(id)) {
//            throw new RuntimeException("Student not found");
//        }
//
//        studentRepository.deleteById(id);
//    }
//
//    public boolean existsByEmail(String email) {
//        return studentRepository.existsByEmail(email);
//    }
//
//
//}


// upar sahi testing



package com.example.stud_erp.service;

import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.StudentFee;
import com.example.stud_erp.exception.CustomException;
import com.example.stud_erp.exception.OTPExpiredException;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.ResetPasswordRequest;
import com.example.stud_erp.payload.StudentDTO;
import com.example.stud_erp.payload.StudentFeeDTO;
import com.example.stud_erp.repository.StudentFeeRepository;
import com.example.stud_erp.repository.StudentRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private StudentFeeRepository studentFeeRepository;

    // ===============================
    // GET ALL STUDENTS
    // ===============================
    @Cacheable("students")
    public List<StudentDTO> findAll() {

        List<Student> students = studentRepository.findByIsDeletedFalse();

        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ===============================
    // GET BY CLASS
    // ===============================
    public List<StudentDTO> getStudentsByClass(int classNumber) {

        List<Student> students =
                studentRepository.findByClassNumberAndIsDeletedFalse(classNumber);

        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ===============================
    // ✅ FIXED CONVERT ENTITY → DTO
    // ===============================
    private StudentDTO convertToDTO(Student student) {

        StudentDTO dto = new StudentDTO();

        dto.setId(student.getId());
        dto.setStudentId(student.getStudentId());
        dto.setUsername(student.getUsername());
        dto.setEmail(student.getEmail());

        // ✅ FINAL FIX
        dto.setClassNumber(student.getClassNumber());
        dto.setClassName(student.getClassName());

        dto.setStudRollNo(student.getStudRollNo());
        dto.setStudName(student.getStudName());
        dto.setStudFatherName(student.getStudFatherName());
        dto.setStudLastName(student.getStudLastName());
        dto.setStudPhoneNumber(student.getStudPhoneNumber());
        dto.setStudentDob(student.getStudentDob());
        dto.setStudCategory(student.getStudCategory());
        dto.setStudCaste(student.getStudCaste());
        dto.setStudentAge(student.getStudentAge());
        dto.setImageUrl(student.getImageUrl());

        // ================== 🔥 ADD THIS PART ==================

        List<StudentFee> fees =
                studentFeeRepository.findByStudentIdOrderByIdDesc(student.getStudentId());

        StudentFee fee = fees.isEmpty() ? null : fees.get(0);

        StudentFeeDTO feeDTO = null;

        if (fee != null) {
            feeDTO = new StudentFeeDTO();
            feeDTO.setTotalFee(fee.getTotalFee());
            feeDTO.setPaidAmount(fee.getPaidAmount());
            feeDTO.setPendingAmount(fee.getPendingAmount());
            feeDTO.setStatus(fee.getStatus());
        }

        dto.setFee(feeDTO);

        return dto;
    }

    // ===============================
    // CREATE STUDENT
    // ===============================
    public Student addStudent(Student student) {

        try {

            // ================= DEFAULT SCHOOL CODE =================
            if (student.getSchoolCode() == null || student.getSchoolCode().isEmpty()) {
                student.setSchoolCode("SCH");
            }

            // ================= VALIDATION =================
            if (student.getStudName() == null || student.getStudName().trim().isEmpty()) {
                throw new CustomException("Student name required");
            }

            if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
                throw new CustomException("Email required");
            }

            student.setEmail(student.getEmail().trim().toLowerCase());

            if (student.getClassNumber() == null || student.getClassNumber() <= 0) {
                throw new CustomException("Valid class required");
            }

            student.setClassName(student.getClassName());

            // ================= DUPLICATE EMAIL CHECK =================
            if (studentRepository.existsByEmail(student.getEmail())) {
                throw new CustomException("Email already exists");
            }

            // ================= AUTO ROLL NUMBER =================
            Long lastRoll = studentRepository.findLastRollNumberByClass(student.getClassNumber());
            Long newRollNo = (lastRoll == null) ? 1 : lastRoll + 1;
            student.setStudRollNo(newRollNo);

            // ================= REGISTRATION NUMBER =================
            String registrationNumber =
                    student.getSchoolCode() + "-" +
                            Year.now().getValue() + "-" +
                            String.format("%04d", studentRepository.count() + 1);

            student.setStudentId(registrationNumber);

            // ================= USERNAME (unique) =================
            String baseUsername = student.getStudName().toLowerCase().replace(" ", "") + newRollNo;
            String username = baseUsername;
            int i = 1;

            while (studentRepository.existsByUsername(username)) {
                username = baseUsername + i;
                i++;
            }

            student.setUsername(username);

            // ================= PASSWORD =================
            String password = generateRandomPassword();
            student.setPassword(password);

            // ================= SAVE STUDENT =================
            Student savedStudent = studentRepository.save(student);

            // ================= 🔥 AUTO CREATE FEE =================
            StudentFee fee = new StudentFee();

            fee.setStudentId(savedStudent.getStudentId());
            fee.setStudentName(savedStudent.getStudName());
            fee.setClassNumber(savedStudent.getClassNumber());

            fee.setMonth(LocalDate.now().getMonth().toString());
            fee.setYear(LocalDate.now().getYear());

            fee.setCreatedDate(LocalDate.now());   // ✅ new field

            fee.setPaidAmount(0.0); // optional (safe default)

            studentFeeRepository.save(fee);

            return savedStudent;

        } catch (DataIntegrityViolationException ex) {
            ex.printStackTrace();
            throw new CustomException("Duplicate student data (email/username)");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error while saving student: " + e.getMessage());
        }
    }

    private String generateRandomPassword() {
        Random random = new Random();
        int number = 1000 + random.nextInt(9000);
        return "Stu@" + number;
    }

    public Optional<Student> getByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }

    public Optional<Student> getById(Long id) {
        return studentRepository.findById(id);
    }

    public Student updateStudent(Long id, Student updatedStudent) {

        return studentRepository.findById(id).map(student -> {

            student.setEmail(updatedStudent.getEmail());
            student.setStudName(updatedStudent.getStudName());
            student.setStudFatherName(updatedStudent.getStudFatherName());
            student.setStudLastName(updatedStudent.getStudLastName());
            student.setStudPhoneNumber(updatedStudent.getStudPhoneNumber());
            student.setStudentDob(updatedStudent.getStudentDob());

            // ✅ FIX
            student.setClassNumber(updatedStudent.getClassNumber());

            student.setStudCategory(updatedStudent.getStudCategory());
            student.setStudCaste(updatedStudent.getStudCaste());
            student.setStudentAge(updatedStudent.getStudentAge());
            student.setImageUrl(updatedStudent.getImageUrl());

            return studentRepository.save(student);

        }).orElseThrow(() -> new CustomException("Student not found"));
    }

    public void deleteStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setDeleted(true);
        studentRepository.save(student);
    }

    public Student authenticateUser(LoginRequest loginRequest) {

        Optional<Student> optionalUser =
                studentRepository.findByUsername(loginRequest.getUsername());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Student user = optionalUser.get();

        if (!loginRequest.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public void sendForgotPasswordEmail(String email) {

        Optional<Student> optionalUser = studentRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new OTPExpiredException("User not found");
        }

        Student user = optionalUser.get();

        String otp = generateOTP();
        user.setOtp(otp);

        studentRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    private String generateOTP() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000));
    }

    public void verifyOTP(String email, String otp) {

        Optional<Student> optionalUser = studentRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new OTPExpiredException("User not found");
        }

        Student user = optionalUser.get();

        if (!user.getOtp().equals(otp)) {
            throw new OTPExpiredException("Invalid OTP");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {

        Optional<Student> optionalUser =
                studentRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            throw new OTPExpiredException("User not found");
        }

        Student user = optionalUser.get();

        user.setPassword(request.getNewPassword());
        studentRepository.save(user);
    }




    // ✅ GET DELETED STUDENTS
    public List<StudentDTO> getDeletedStudents() {

        List<Student> students = studentRepository.findByIsDeletedTrue();

        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // ✅ RESTORE STUDENT
    public void restoreStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setDeleted(false);

        studentRepository.save(student);
    }


    // ❌ PERMANENT DELETE
    public void deletePermanently(Long id) {

        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found");
        }

        studentRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }




    // ===============================================
// ✅ NEW METHOD: FIND STUDENT BY CLASS + ROLL
// ===============================================
    public Optional<Student> findByClassNumberAndStudRollNo(int classNumber, Long rollNo) {

        return studentRepository
                .findByClassNumberAndStudRollNo(classNumber, rollNo);
    }
}