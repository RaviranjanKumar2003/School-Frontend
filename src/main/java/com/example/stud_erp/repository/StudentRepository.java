//
//package com.example.stud_erp.repository;
//
//import com.example.stud_erp.entity.Student;
//import com.example.stud_erp.payload.StudentDto;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.Optional;
//import java.util.List;
//
//public interface StudentRepository extends JpaRepository<Student, Long> {
//
//
//    Optional<Student> findByUsername(String username);
//
//    Optional<Student> findByEmail(String email);
//
//    boolean existsByEmail(String email);
//
//    boolean existsByUsername(String username);
//
//    boolean existsByStudentId(String studentId);
//
//    Optional<Student> findByStudentId(String studentId);
//
//    Optional<Student> findByUsernameAndPassword(
//            String username,
//            String password
//    );
//
//    Optional<Student> findByStudName(String studName);
//
//    boolean existsByStudRollNo(Long studRollNo);
//
//    boolean existsByStudentIdOrUsernameOrEmailOrStudRollNo(
//            String studentId,
//            String username,
//            String email,
//            Long studRollNo
//    );
//
//    // =========================================================
//    // SCHOOL WISE
//    // =========================================================
//
//    List<Student> findBySchoolIdAndIsDeletedFalse(Long schoolId);
//
//    List<Student> findBySchoolIdAndClassNumberAndIsDeletedFalse(
//            Long schoolId,
//            Long classNumber
//    );
//
//    Long countBySchoolIdAndIsDeletedFalse(Long schoolId);
//
//    // =========================================================
//    // ACTIVE / ARCHIVE
//    // =========================================================
//
//    List<Student> findByIsDeletedFalse();
//
//    List<Student> findByIsDeletedTrue();
//
//    List<Student> findByClassNumberAndIsDeletedFalse(
//            Long classNumber
//    );
//
//
//    List<Student> findByClassNumber(Long classNumber);
//
//    List<Student> findBySchoolIdAndIsDeletedTrue(Long schoolId);
//
//    // =========================================================
//    // ROLL NUMBER
//    // =========================================================
//
//    @Query("""
//        SELECT s.studRollNo
//        FROM Student s
//        WHERE s.classNumber = :classNumber
//        AND s.isDeleted = false
//        ORDER BY s.studRollNo ASC
//    """)
//    List<Long> findActiveRollsByClass(
//            @Param("classNumber") Long classNumber
//    );
//
//    boolean existsByClassNumberAndStudRollNoAndIsDeletedFalse(
//            Long classNumber,
//            Long studRollNo
//    );
//
//    Optional<Student> findByClassNumberAndStudRollNo(
//            Long classNumber,
//            Long studRollNo
//    );
//
//    List<Student> findByClassNameIgnoreCase(String className);
//
//    @Query("SELECT MAX(s.id) FROM Student s")
//    Long findMaxId();
//
//    Long countByClassNumber(Long classNumber);
//
//    // =========================================================
//    // DTO
//    // =========================================================
//
//    @Query("""
//        SELECT new com.example.stud_erp.payload.StudentDTO(
//            s.username,
//            s.email
//        )
//        FROM Student s
//        WHERE s.id = :id
//    """)
//    Optional<StudentDto> findStudentUsernameAndEmailById(
//            Long id
//    );
//
//}



//====================================================================================== NEW

package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Student;
import com.example.stud_erp.enums.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // =========================================================
    // LOGIN / AUTH
    // =========================================================

    Optional<Student> findByUsername(String username);

    Optional<Student> findByEmail(String email);

    Optional<Student> findByStudentId(String studentId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByStudentId(String studentId);

    // =========================================================
    // NAME
    // =========================================================

    Optional<Student> findByStudfirstName(String studfirstName);

    List<Student> findByStudfirstNameContainingIgnoreCase(
            String keyword
    );

    // =========================================================
    // SCHOOL WISE
    // =========================================================

    @Query("""
        SELECT s
        FROM Student s
        WHERE s.school.id = :schoolId
        AND s.isDeleted = false
        ORDER BY s.id DESC
    """)
    List<Student> findBySchoolIdAndIsDeletedFalse(
            @Param("schoolId") Long schoolId
    );

    @Query("""
        SELECT s
        FROM Student s
        WHERE s.school.id = :schoolId
        AND s.isDeleted = true
        ORDER BY s.id DESC
    """)
    List<Student> findBySchoolIdAndIsDeletedTrue(
            @Param("schoolId") Long schoolId
    );

    // =========================================================
    // CLASS WISE
    // =========================================================

    @Query("""
        SELECT s
        FROM Student s
        WHERE s.school.id = :schoolId
        AND LOWER(s.className) = LOWER(:className)
        AND s.isDeleted = false
        ORDER BY s.studRollNo ASC
    """)
    List<Student> findBySchoolIdAndClassNameAndIsDeletedFalse(
            @Param("schoolId") Long schoolId,
            @Param("className") String className
    );

    List<Student> findByClassNameIgnoreCase(String className);

    List<Student> findByClassNameAndIsDeletedFalse(
            String className
    );

    List<Student> findByClassEntity_IdAndIsDeletedFalse(Long classId);

    Long countBySchoolIdAndClassNameAndIsDeletedFalse(
            Long schoolId,
            String className
    );

    // =========================================================
    // ROLL NUMBER
    // =========================================================

    boolean existsByStudRollNo(Long studRollNo);

    boolean existsByClassNameAndStudRollNoAndIsDeletedFalse(
            String className,
            Long studRollNo
    );

    Optional<Student> findByClassNameAndStudRollNo(
            String className,
            Long studRollNo
    );

    @Query("""
        SELECT s.studRollNo
        FROM Student s
        WHERE s.className = :className
        AND s.isDeleted = false
        ORDER BY s.studRollNo ASC
    """)
    List<Long> findActiveRollsByClass(
            @Param("className") String className
    );

    Long countByClassNameAndIsDeletedFalse(
            String className
    );

    // =========================================================
    // STATUS
    // =========================================================

    Long countBySchoolIdAndStatusAndIsDeletedFalse(
            Long schoolId,
            StudentStatus status
    );

    List<Student> findByStatus(StudentStatus status);

    // =========================================================
    // TOTAL COUNT
    // =========================================================

    @Query("""
        SELECT COUNT(s)
        FROM Student s
        WHERE s.school.id = :schoolId
        AND s.isDeleted = false
    """)
    Long countBySchoolIdAndIsDeletedFalse(
            @Param("schoolId") Long schoolId
    );

    @Query("""
        SELECT COUNT(s)
        FROM Student s
        WHERE s.school.id = :schoolId
        AND s.isDeleted = true
    """)
    Long countBySchoolIdAndIsDeletedTrue(
            @Param("schoolId") Long schoolId
    );

    // =========================================================
    // SEARCH
    // =========================================================

    @Query("""
        SELECT s
        FROM Student s
        WHERE s.school.id = :schoolId
        AND s.isDeleted = false
        AND (
            LOWER(s.studfirstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(s.studlastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(s.studentId) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(s.className) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        ORDER BY s.id DESC
    """)
    List<Student> searchStudents(
            @Param("schoolId") Long schoolId,
            @Param("keyword") String keyword
    );

    // =========================================================
    // QR CODE
    // =========================================================

    Optional<Student> findByQrCodeUrl(String qrCodeUrl);

    // =========================================================
    // ACTIVE / DELETED
    // =========================================================

    List<Student> findByIsDeletedFalse();

    List<Student> findByIsDeletedTrue();

    // =========================================================
    // MAX ID
    // =========================================================

    @Query("""
        SELECT MAX(s.id)
        FROM Student s
    """)
    Long findMaxId();
}