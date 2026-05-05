//package com.example.stud_erp.repository;
//
//import com.example.stud_erp.entity.StudentFee;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface StudentFeeRepository extends JpaRepository<StudentFee, Long> {
//
//    // Filter by status (PAID / PENDING)
//    List<StudentFee> findByStatus(String status);
//
//    // Filter by class
//    List<StudentFee> findByClassName(String className);
//
//    // Search by student name
//    List<StudentFee> findByStudentNameContainingIgnoreCase(String name);
//}




package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.StudentFee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentFeeRepository extends JpaRepository<StudentFee, Long> {

    List<StudentFee> findByStatus(String status);
    List<StudentFee> findByStudentNameContainingIgnoreCase(String name);

    List<StudentFee> findByMonth(String month);

    Optional<StudentFee> findByStudentIdAndMonthAndYear(
            String studentId,
            String month,
            int year
    );

    List<StudentFee> findByStudentId(String studentId);

    List<StudentFee> findByStudentIdOrderByIdDesc(String studentId);

    List<StudentFee> findByMonthAndYear(String month, int year);

    List<StudentFee> findByClassNumberAndMonthAndYear(Integer classNumber, String month, int year);

    List<StudentFee> findByClassNumber(Integer classNumber);

    StudentFee findTopByStudentIdOrderByIdDesc(String studentId);


}