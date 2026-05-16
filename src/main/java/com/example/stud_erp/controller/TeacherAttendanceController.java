//package com.example.stud_erp.controller;
//import com.example.stud_erp.entity.TeacherAttendance;
//import com.example.stud_erp.payload.TeacherAttendanceDTO;
//import com.example.stud_erp.service.TeacherAttendanceService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/attendance/teacher")
//@CrossOrigin("*")
//public class TeacherAttendanceController {
//
//    @Autowired
//    private TeacherAttendanceService service;
//
//    // ================= SAVE =================
//    @PostMapping("/save")
//    public String save(
//            @RequestParam Long schoolId,
//            @RequestBody List<TeacherAttendance> list
//    ) {
//        return service.saveOrUpdate(schoolId, list);
//    }
//
//    // ================= GET BY DATE =================
//    @GetMapping
//    public List<TeacherAttendanceDTO> getByDate(
//            @RequestParam Long schoolId,
//            @RequestParam String date
//    ) {
//        return service.getByDate(schoolId, LocalDate.parse(date));
//    }
//
//    // ================= WEEKLY =================
//    @GetMapping("/weekly")
//    public List<TeacherAttendanceDTO> weekly(
//            @RequestParam Long schoolId
//    ) {
//        return service.getWeekly(schoolId);
//    }
//}



//========================================================================================= NEW

package com.example.stud_erp.controller;

import com.example.stud_erp.entity.TeacherAttendance;
import com.example.stud_erp.payload.TeacherAttendanceDTO;
import com.example.stud_erp.service.TeacherAttendanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance/teacher")
@CrossOrigin("*")

public class TeacherAttendanceController {

    @Autowired
    private TeacherAttendanceService service;

    // ================= SAVE =================

    @PostMapping("/save")
    public String save(

            @RequestParam Long schoolId,

            @RequestParam(defaultValue = "false")
            Boolean forceUpdate,

            @RequestBody
            List<TeacherAttendance> list

    ) {

        return service.saveOrUpdate(
                schoolId,
                forceUpdate,
                list
        );
    }

    // ================= GET BY DATE =================

    @GetMapping
    public List<TeacherAttendanceDTO> getByDate(

            @RequestParam Long schoolId,

            @RequestParam String attendanceDate

    ) {

        return service.getByDate(
                schoolId,
                LocalDate.parse(attendanceDate)
        );
    }

    // ================= WEEKLY =================

    @GetMapping("/weekly")
    public List<TeacherAttendanceDTO> weekly(

            @RequestParam Long schoolId

    ) {

        return service.getWeekly(
                schoolId
        );
    }
}