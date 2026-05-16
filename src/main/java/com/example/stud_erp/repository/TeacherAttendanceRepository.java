//package com.example.stud_erp.repository;
//
//import com.example.stud_erp.entity.TeacherAttendance;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Optional;
//
//public interface TeacherAttendanceRepository extends JpaRepository<TeacherAttendance, Long> {
//
//    Optional<TeacherAttendance> findByTeacherIdAndDate(Long teacherId, LocalDate date);
//
//    List<TeacherAttendance> findByDate(LocalDate date);
//
//    List<TeacherAttendance> findBySchoolIdAndDate(Long schoolId, LocalDate date);
//
//    List<TeacherAttendance> findBySchoolId(Long schoolId);
//
//}


//==================================================================================================== NEW

package com.example.stud_erp.repository;

import com.example.stud_erp.entity.TeacherAttendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TeacherAttendanceRepository
        extends JpaRepository<TeacherAttendance, Long> {

    List<TeacherAttendance>
    findAllBySchoolIdAndTeacherIdAndAttendanceDate(
            Long schoolId,
            Long teacherId,
            LocalDate attendanceDate
    );

    List<TeacherAttendance>
    findBySchoolIdAndAttendanceDate(
            Long schoolId,
            LocalDate attendanceDate
    );
}