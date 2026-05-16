//package com.example.stud_erp.service;
//
//import com.example.stud_erp.entity.Student;
//import com.example.stud_erp.payload.LoginRequest;
//import com.example.stud_erp.payload.LoginResponse;
//import com.example.stud_erp.payload.StudentDTO;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Optional;
//
//public interface StudentService {
//
//    // ================= CREATE =================
//    Student createStudent(
//            Student student,
//            MultipartFile image
//    ) throws IOException;
//
//    // ================= UPDATE =================
//    Student updateStudent(
//            Long id,
//            Student student,
//            MultipartFile image
//    ) throws IOException;
//
//    // ================= DELETE =================
//    void deleteStudent(Long id);
//
//    // ================= GET =================
//    List<StudentDTO> getAllStudents(Long schoolId);
//
//    List<StudentDTO> getStudentsByClass(
//            Long schoolId,
//            Long classNumber
//    );
//
//    Optional<Student> getStudentById(Long id);
//
//    Optional<Student> getByStudentId(String studentId);
//
//    public List<StudentDTO> getDeletedStudents(Long schoolId);
//
//    void restoreStudent(Long id);
//
//    void permanentDelete(Long id);
//
//    // ================= COUNT =================
//    Long getTotalStudents(Long schoolId);
//
//    // ================= LOGIN =================
//    LoginResponse authenticateUser(LoginRequest request);
//
//    Student getById(Long id);
//}



//========================================================================================= NEW

package com.example.stud_erp.service;

import com.example.stud_erp.entity.Student;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.LoginResponse;
import com.example.stud_erp.payload.StudentDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface StudentService {

    // =========================================================
    // CREATE
    // =========================================================

    StudentDto createStudent(
            StudentDto studentDto,
            MultipartFile image
    ) throws IOException;

    // =========================================================
    // UPDATE
    // =========================================================

    StudentDto updateStudent(
            Long id,
            StudentDto studentDto,
            MultipartFile image
    ) throws IOException;

    // =========================================================
    // DELETE
    // =========================================================

    void deleteStudent(Long id);

    void restoreStudent(Long id);

    void permanentDelete(Long id);

    // =========================================================
    // GET STUDENTS
    // =========================================================

    List<StudentDto> getAllStudents(Long schoolId);

    List<StudentDto> getDeletedStudents(Long schoolId);

    List<StudentDto> getStudentsByClass(
            Long schoolId,
            String className
    );

    StudentDto getStudentById(Long id);

    StudentDto getByStudentId(String studentId);

    Student getStudentEntityById(Long id);

    // =========================================================
    // COUNT
    // =========================================================

    Long getTotalStudents(Long schoolId);

    Long getTotalActiveStudents(Long schoolId);

    Long getTotalDeletedStudents(Long schoolId);

    // =========================================================
    // LOGIN
    // =========================================================

    LoginResponse authenticateUser(LoginRequest request);

    // =========================================================
    // SEARCH
    // =========================================================

    List<StudentDto> searchStudents(
            Long schoolId,
            String keyword
    );

    // =========================================================
    // ATTENDANCE / QR
    // =========================================================

    StudentDto getStudentByQrCode(String qrCode);

    // =========================================================
    // STATUS
    // =========================================================

    void updateStudentStatus(
            Long studentId,
            String status
    );
}
