package com.example.stud_erp.controller;

import com.example.stud_erp.entity.ExamSchedule;
import com.example.stud_erp.entity.StudentExam;
import com.example.stud_erp.enums.ExamType;
import com.example.stud_erp.payload.ExamScheduleDTO;
import com.example.stud_erp.payload.ExamStatusDTO;
import com.example.stud_erp.payload.StudentExamAttendanceDTO;
import com.example.stud_erp.payload.StudentExamDTO;
import com.example.stud_erp.service.ExamScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/exam-schedule")
@CrossOrigin("*")
public class ExamScheduleController {

    @Autowired
    private ExamScheduleService service;

    // CREATE
    @PostMapping
    public String create(@RequestBody ExamSchedule req) {
        service.createSchedule(req);
        return "Exam Created";
    }

//    wo student jiska class ka exam hai

    @GetMapping("/student/{studentId}")
    public List<StudentExamDTO> getStudentExams(
            @PathVariable Long studentId) {

        return service.getStudentExams(studentId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public String update(@PathVariable Long id,
                         @RequestBody ExamSchedule req) {
        service.update(id, req);
        return "Updated";
    }

    // CANCEL (🔥 reason)
    @PutMapping("/cancel/{id}")
    public String cancel(@PathVariable Long id,
                         @RequestParam String reason) {
        service.cancel(id, reason);
        return "Cancelled";
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // TEACHER VIEW
    @GetMapping("/teacher/{teacherId}")
    public List<ExamSchedule> getTeacher(@PathVariable Long teacherId) {
        return service.getTeacher(teacherId);
    }

    // All teacher
    @GetMapping
    public List<ExamScheduleDTO> getAll() {
        return service.getAllExams();
    }

//    teacher Attendance exam ke din Banayga
    @PutMapping("/exam_attendance")
    public void markAttendance(@RequestBody StudentExam req) {
        service.markAttendance(req);
    }

    @GetMapping("/class/{classId}/{teacherId}")
    public List<StudentExamAttendanceDTO> getByClass(
            @PathVariable Long classId,
            @PathVariable Long teacherId) {

        return service.getStudentsByClass(classId, teacherId);
    }

    //   result dete time teacher view dekh ke rusult dega
    @GetMapping("/result/{classId}/{teacherId}")
    public List<StudentExamAttendanceDTO> getStudentsForResult(
            @PathVariable Long classId,
            @PathVariable Long teacherId
    ) {
        return service.getStudentsForResult(classId, teacherId);
    }

    @GetMapping("/status/{classId}/{examType}")
    public List<ExamStatusDTO> getStatus(
            @PathVariable Long classId,
            @PathVariable String examType
    ) {
        return service.getClassExamStatus(classId, examType);
    }

    @GetMapping("/exam-types")
    public List<String> getExamTypes() {
        return Arrays.stream(ExamType.values())
                .map(Enum::name)
                .toList();
    }
}