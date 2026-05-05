package com.example.stud_erp.controller;

import com.example.stud_erp.entity.ExamNotice;
import com.example.stud_erp.payload.ExamNoticeDTO;
import com.example.stud_erp.service.ExamNoticeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-notice")
@CrossOrigin("*")
public class ExamNoticeController {

    @Autowired
    private ExamNoticeService service;

    // ✅ ADMIN → create exam
    @PostMapping("/create")
    public String create(@RequestBody ExamNotice req) {

        service.createExamNotice(
                req.getClassId(),
                req.getExamType(),
                req.getMessage() // 🔥 IMPORTANT
        );

        return "Exam Notice Created ✅";
    }

    // ✅ TEACHER → view notice
    @GetMapping("/teacher/{teacherId}")
    public List<ExamNoticeDTO> getTeacher(@PathVariable Long teacherId) {
        return service.getTeacherNotices(teacherId);
    }

    // GET ALL
    @GetMapping("/all")
    public List<ExamNoticeDTO> getAll() {
        return service.getAll();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // ✅ UPDATE
    @PutMapping("/update")
    public String updateExam(@RequestBody ExamNotice req) {

        service.updateExamNotice(req.getIds(), req.getMessage());

        return "Exam Updated ✅";
    }
}