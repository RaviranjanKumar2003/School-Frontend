package com.example.stud_erp.repository;

import com.example.stud_erp.entity.StuAttendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StuAttendanceRepository
        extends JpaRepository<StuAttendance, Long> {

    // =========================================================
    // CLASS + SECTION + DATE
    // =========================================================

    List<StuAttendance>
    findBySchoolIdAndClassIdAndSectionAndAttendanceDate(

            Long schoolId,

            Long classId,

            String section,

            LocalDate attendanceDate
    );

    // =========================================================
    // CLASS + DATE
    // =========================================================

    List<StuAttendance>
    findBySchoolIdAndClassIdAndAttendanceDate(

            Long schoolId,

            Long classId,

            LocalDate attendanceDate
    );

    // =========================================================
    // SECTION + DATE
    // =========================================================

    List<StuAttendance>
    findBySchoolIdAndSectionAndAttendanceDate(

            Long schoolId,

            String section,

            LocalDate attendanceDate
    );

    // =========================================================
    // SCHOOL + DATE
    // =========================================================

    List<StuAttendance>
    findBySchoolIdAndAttendanceDate(

            Long schoolId,

            LocalDate attendanceDate
    );

    // =========================================================
    // STUDENT ATTENDANCE
    // =========================================================

    List<StuAttendance>
    findByStudent_Id(

            Long studentId
    );

    // =========================================================
    // STUDENT + DATE
    // =========================================================

    Optional<StuAttendance>
    findByStudent_IdAndAttendanceDate(

            Long studentId,

            LocalDate attendanceDate
    );

    // =========================================================
    // DUPLICATE CHECK
    // =========================================================

    Optional<StuAttendance>
    findByStudent_IdAndAttendanceDateAndClassIdAndSection(

            Long studentId,

            LocalDate attendanceDate,

            Long classId,

            String section
    );

    // =========================================================
    // EXISTS CHECK
    // =========================================================

    boolean existsByStudent_IdAndAttendanceDateAndClassIdAndSection(

            Long studentId,

            LocalDate attendanceDate,

            Long classId,

            String section
    );

    // =========================================================
    // QR SCAN CHECK
    // =========================================================

    boolean existsByStudent_IdAndAttendanceDate(

            Long studentId,

            LocalDate attendanceDate
    );

    // =========================================================
    // PRESENT STUDENTS
    // =========================================================

    List<StuAttendance>
    findBySchoolIdAndAttendanceDateAndStatus(

            Long schoolId,

            LocalDate attendanceDate,

            String status
    );

    // =========================================================
    // CLASS + SECTION + STATUS
    // =========================================================

    List<StuAttendance>
    findBySchoolIdAndClassIdAndSectionAndAttendanceDateAndStatus(

            Long schoolId,

            Long classId,

            String section,

            LocalDate attendanceDate,

            String status
    );

    // =========================================================
    // WEEKLY / MONTHLY REPORT
    // =========================================================

    List<StuAttendance>
    findBySchoolId(

            Long schoolId
    );

    // =========================================================
    // DELETE ATTENDANCE
    // =========================================================

    void deleteById(

            Long attendanceId
    );

}