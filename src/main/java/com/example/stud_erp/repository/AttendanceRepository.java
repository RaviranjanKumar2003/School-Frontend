
package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Attendance;
import com.example.stud_erp.entity.TeacherAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // ✅ FIXED QUERY (date ab ClassSession se aayegi)
    @Query("""
        SELECT ar FROM Attendance ar
        WHERE ar.classSession.lecturer = :lecturer
        AND ar.classSession.subject = :subject
        ORDER BY ar.classSession.date ASC
    """)
    List<Attendance> findByClassSessionLecturerAndClassSessionSubject(
            String lecturer,
            String subject
    );

    // ✅ Student wise attendance
    List<Attendance> findByStudent_Id(Long studentId);

    // ✅ Already correct
    List<Attendance> findByClassSession_LecturerAndClassSession_SubjectOrderByClassSession_DateAsc(
            String lecturer,
            String subject
    );

    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByClassNumberAndDate(Integer classNumber, LocalDate date);
}