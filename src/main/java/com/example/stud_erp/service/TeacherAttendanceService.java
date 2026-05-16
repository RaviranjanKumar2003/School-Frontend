//package com.example.stud_erp.service;
//
//import com.example.stud_erp.entity.TeacherAttendance;
//import com.example.stud_erp.payload.TeacherAttendanceDTO;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public interface TeacherAttendanceService {
//
//    String saveOrUpdate(Long schoolId, List<TeacherAttendance> list);
//
//    List<TeacherAttendanceDTO> getByDate(Long schoolId, LocalDate date);
//
//    List<TeacherAttendanceDTO> getWeekly(Long schoolId);
//
//
//}



package com.example.stud_erp.service;

import com.example.stud_erp.entity.TeacherAttendance;
import com.example.stud_erp.payload.TeacherAttendanceDTO;

import java.time.LocalDate;
import java.util.List;

public interface TeacherAttendanceService {

    String saveOrUpdate(
            Long schoolId,
            Boolean forceUpdate,
            List<TeacherAttendance> list
    );

    List<TeacherAttendanceDTO> getByDate(
            Long schoolId,
            LocalDate attendanceDate
    );

    List<TeacherAttendanceDTO> getWeekly(
            Long schoolId
    );
}