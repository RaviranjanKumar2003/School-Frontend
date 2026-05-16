package com.example.stud_erp.controller;

import com.example.stud_erp.entity.StuAttendance;
import com.example.stud_erp.payload.StuAttendanceDTO;
import com.example.stud_erp.service.StuAttendanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stu-attendance")
@CrossOrigin("*")
public class StuAttendanceController {

    @Autowired
    private StuAttendanceService service;

    // =========================================================
    // SAVE MANUAL ATTENDANCE
    // =========================================================

    @PostMapping("/save")
    public String save(

            @RequestParam Long schoolId,

            @RequestParam Long classId,

            @RequestParam String section,

            @RequestParam String attendanceDate,

            @RequestParam Long takenById,

            @RequestParam String takenByName,

            @RequestParam String takenByRole,

            @RequestBody List<StuAttendanceDTO> list
    ) {

        return service.save(

                schoolId,

                classId,

                section,

                LocalDate.parse(attendanceDate),

                takenById,

                takenByName,

                takenByRole,

                list
        );
    }

    // =========================================================
    // QR SCAN ATTENDANCE
    // =========================================================

    @PostMapping("/scan-qr")
    public String scanQrAttendance(

            @RequestParam String studentId,

            @RequestParam Long schoolId,

            @RequestParam Long takenById,

            @RequestParam String takenByName,

            @RequestParam String takenByRole
    ) {

        return service.markAttendanceByQr(

                studentId,

                schoolId,

                takenById,

                takenByName,

                takenByRole
        );
    }

    // =========================================================
    // GET CLASS + SECTION ATTENDANCE
    // =========================================================

    @GetMapping
    public List<StuAttendanceDTO> getAttendance(

            @RequestParam Long schoolId,

            @RequestParam Long classId,

            @RequestParam String section,

            @RequestParam String attendanceDate
    ) {

        return service.getByClassAndDate(

                schoolId,

                classId,

                section,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // GET ATTENDANCE BY ID
    // =========================================================

    @GetMapping("/{attendanceId}")
    public StuAttendanceDTO getAttendanceById(

            @PathVariable Long attendanceId
    ) {

        return service.getAttendanceById(
                attendanceId
        );
    }

    // =========================================================
    // GET DAILY ATTENDANCE
    // =========================================================

    @GetMapping("/daily")
    public List<StuAttendance> getDailyAttendance(

            @RequestParam Long schoolId,

            @RequestParam String attendanceDate
    ) {

        return service.getByDate(

                schoolId,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // GET SECTION ATTENDANCE
    // =========================================================

    @GetMapping("/section")
    public List<StuAttendanceDTO> getSectionAttendance(

            @RequestParam Long schoolId,

            @RequestParam String section,

            @RequestParam String attendanceDate
    ) {

        return service.getSectionAttendance(

                schoolId,

                section,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // GET PRESENT STUDENTS
    // =========================================================

    @GetMapping("/present")
    public List<StuAttendanceDTO> getPresentStudents(

            @RequestParam Long schoolId,

            @RequestParam String attendanceDate
    ) {

        return service.getPresentStudents(

                schoolId,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // GET ABSENT STUDENTS
    // =========================================================

    @GetMapping("/absent")
    public List<StuAttendanceDTO> getAbsentStudents(

            @RequestParam Long schoolId,

            @RequestParam String attendanceDate
    ) {

        return service.getAbsentStudents(

                schoolId,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // UPDATE ATTENDANCE
    // =========================================================

    @PutMapping("/update/{attendanceId}")
    public String updateAttendance(

            @PathVariable Long attendanceId,

            @RequestParam String status,

            @RequestParam Long updatedById,

            @RequestParam String updatedByName,

            @RequestParam String updatedByRole
    ) {

        return service.updateAttendance(

                attendanceId,

                status,

                updatedById,

                updatedByName,

                updatedByRole
        );
    }

    // =========================================================
    // DELETE SINGLE ATTENDANCE
    // =========================================================

    @DeleteMapping("/delete/{attendanceId}")
    public String deleteAttendance(

            @PathVariable Long attendanceId
    ) {

        return service.deleteAttendance(
                attendanceId
        );
    }

    // =========================================================
    // DELETE DATE ATTENDANCE
    // =========================================================

    @DeleteMapping("/delete-by-date")
    public String deleteAttendanceByDate(

            @RequestParam Long schoolId,

            @RequestParam String attendanceDate
    ) {

        return service.deleteAttendanceByDate(

                schoolId,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // TODAY SUMMARY
    // =========================================================

    @GetMapping("/today-summary/{schoolId}")
    public Map<String, Object> getTodaySummary(

            @PathVariable Long schoolId
    ) {

        return service.getTodaySummary(
                schoolId
        );
    }

    // =========================================================
    // DATE SUMMARY
    // =========================================================

    @GetMapping("/summary/{schoolId}")
    public Map<String, Object> getSummaryByDate(

            @PathVariable Long schoolId,

            @RequestParam String attendanceDate
    ) {

        return service.getSummaryByDate(

                schoolId,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // WEEKLY SUMMARY
    // =========================================================

    @GetMapping("/weekly-summary/{schoolId}")
    public List<Map<String, Object>> getWeeklySummary(

            @PathVariable Long schoolId
    ) {

        return service.getWeeklySummary(
                schoolId
        );
    }

    // =========================================================
    // MONTHLY SUMMARY
    // =========================================================

    @GetMapping("/monthly-summary/{schoolId}")
    public List<Map<String, Object>> getMonthlySummary(

            @PathVariable Long schoolId
    ) {

        return service.getMonthlySummary(
                schoolId
        );
    }

    // =========================================================
    // PRESENT COUNT
    // =========================================================

    @GetMapping("/present-count")
    public long getPresentCount(

            @RequestParam Long schoolId,

            @RequestParam String attendanceDate
    ) {

        return service.getPresentCount(

                schoolId,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // ABSENT COUNT
    // =========================================================

    @GetMapping("/absent-count")
    public long getAbsentCount(

            @RequestParam Long schoolId,

            @RequestParam String attendanceDate
    ) {

        return service.getAbsentCount(

                schoolId,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // CHECK ATTENDANCE MARKED
    // =========================================================

    @GetMapping("/is-marked")
    public boolean isAttendanceMarked(

            @RequestParam Long studentId,

            @RequestParam String attendanceDate
    ) {

        return service.isAttendanceMarked(

                studentId,

                LocalDate.parse(attendanceDate)
        );
    }

    // =========================================================
    // STUDENT ATTENDANCE HISTORY
    // =========================================================

    @GetMapping("/student/{studentId}")
    public List<StuAttendanceDTO> getStudentAttendance(

            @PathVariable Long studentId
    ) {

        return service.getStudentAttendance(
                studentId
        );
    }

    // =========================================================
    // CLASS ATTENDANCE COUNT
    // =========================================================

    @GetMapping("/class-count")
    public long getClassAttendanceCount(

            @RequestParam Long schoolId,

            @RequestParam Long classId,

            @RequestParam String section,

            @RequestParam String attendanceDate
    ) {

        return service.getClassAttendanceCount(

                schoolId,

                classId,

                section,

                LocalDate.parse(attendanceDate)
        );
    }
}