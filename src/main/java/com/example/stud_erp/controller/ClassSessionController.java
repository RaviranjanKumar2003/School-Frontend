package com.example.stud_erp.controller;

import com.example.stud_erp.entity.ClassSession;
import com.example.stud_erp.service.ClassSessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class-session")
@CrossOrigin("*")
public class ClassSessionController {

    @Autowired
    private ClassSessionService service;

    // 🔥 CREATE SESSION
    @PostMapping("/create")
    public ClassSession create(@RequestBody ClassSession session) {
        return service.createSession(session);
    }

    // 🔥 GET ALL
    @GetMapping("/all")
    public List<ClassSession> getAll() {
        return service.getAllSessions();
    }

    // 🔥 GET BY CLASS
    @GetMapping("/class/{classNumber}")
    public List<ClassSession> getByClass(@PathVariable Integer classNumber) {
        return service.getByClass(classNumber);
    }

    // 🔥 DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteSession(id);
        return "Session Deleted";
    }
}