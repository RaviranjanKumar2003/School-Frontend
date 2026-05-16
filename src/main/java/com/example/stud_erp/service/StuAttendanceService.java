//package com.example.stud_erp.service;
//
//import com.example.stud_erp.entity.StuAttendance;
//import com.example.stud_erp.payload.StuAttendanceDTO;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public interface StuAttendanceService {
//
//    String save(Integer classNumber, LocalDate date, List<StuAttendanceDTO> list);
//
//    List<StuAttendanceDTO> getByClassAndDate(Integer classNumber, LocalDate date);
//
//    List<StuAttendance> getByDate(LocalDate date);
//
//}



package com.example.stud_erp.service;

import com.example.stud_erp.entity.StuAttendance;
import com.example.stud_erp.payload.StuAttendanceDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface StuAttendanceService {

    // =========================================================
    // SAVE MANUAL ATTENDANCE
    // =========================================================

    String save(

            Long schoolId,

            Long classId,

            String section,

            LocalDate attendanceDate,

            Long takenById,

            String takenByName,

            String takenByRole,

            List<StuAttendanceDTO> list
    );

    // =========================================================
    // QR SCAN ATTENDANCE
    // =========================================================

    String markAttendanceByQr(

            String studentId,

            Long schoolId,

            Long takenById,

            String takenByName,

            String takenByRole
    );

    // =========================================================
    // GET ATTENDANCE BY CLASS + SECTION + DATE
    // =========================================================

    List<StuAttendanceDTO> getByClassAndDate(

            Long schoolId,

            Long classId,

            String section,

            LocalDate attendanceDate
    );

    // =========================================================
    // GET DAILY ATTENDANCE
    // =========================================================

    List<StuAttendance> getByDate(

            Long schoolId,

            LocalDate attendanceDate
    );

    // =========================================================
    // GET STUDENT ATTENDANCE HISTORY
    // =========================================================

    List<StuAttendanceDTO> getStudentAttendance(

            Long studentId
    );

    // =========================================================
    // GET SECTION ATTENDANCE
    // =========================================================

    List<StuAttendanceDTO> getSectionAttendance(

            Long schoolId,

            String section,

            LocalDate attendanceDate
    );

    // =========================================================
    // GET PRESENT STUDENTS
    // =========================================================

    List<StuAttendanceDTO> getPresentStudents(

            Long schoolId,

            LocalDate attendanceDate
    );

    // =========================================================
    // GET ABSENT STUDENTS
    // =========================================================

    List<StuAttendanceDTO> getAbsentStudents(

            Long schoolId,

            LocalDate attendanceDate
    );

    // =========================================================
    // UPDATE SINGLE ATTENDANCE
    // =========================================================

    String updateAttendance(

            Long attendanceId,

            String status,

            Long updatedById,

            String updatedByName,

            String updatedByRole
    );

    // =========================================================
    // DELETE ATTENDANCE
    // =========================================================

    String deleteAttendance(

            Long attendanceId
    );

    // =========================================================
    // TODAY SUMMARY
    // =========================================================

    Map<String, Object> getTodaySummary(

            Long schoolId
    );

    // =========================================================
    // DATE WISE SUMMARY
    // =========================================================

    Map<String, Object> getSummaryByDate(

            Long schoolId,

            LocalDate attendanceDate
    );

    // =========================================================
    // WEEKLY SUMMARY
    // =========================================================

    List<Map<String, Object>> getWeeklySummary(

            Long schoolId
    );

    // =========================================================
    // MONTHLY SUMMARY
    // =========================================================

    List<Map<String, Object>> getMonthlySummary(

            Long schoolId
    );

    // =========================================================
    // TOTAL PRESENT COUNT
    // =========================================================

    long getPresentCount(

            Long schoolId,

            LocalDate attendanceDate
    );

    // =========================================================
    // TOTAL ABSENT COUNT
    // =========================================================

    long getAbsentCount(

            Long schoolId,

            LocalDate attendanceDate
    );

    // =========================================================
    // CHECK STUDENT ATTENDANCE
    // =========================================================

    boolean isAttendanceMarked(

            Long studentId,

            LocalDate attendanceDate
    );

    // =========================================================
    // GET SINGLE ATTENDANCE
    // =========================================================

    StuAttendanceDTO getAttendanceById(

            Long attendanceId
    );

    // =========================================================
    // GET CLASS ATTENDANCE COUNT
    // =========================================================

    long getClassAttendanceCount(

            Long schoolId,

            Long classId,

            String section,

            LocalDate attendanceDate
    );

    // =========================================================
    // BULK DELETE
    // =========================================================

    String deleteAttendanceByDate(

            Long schoolId,

            LocalDate attendanceDate
    );

}