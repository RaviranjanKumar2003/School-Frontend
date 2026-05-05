package com.example.stud_erp.service;

import com.example.stud_erp.entity.ClassSession;

import java.util.List;

public interface ClassSessionService {

    // 🔥 CREATE SESSION
    ClassSession createSession(ClassSession session);

    // 🔥 GET ALL
    List<ClassSession> getAllSessions();

    // 🔥 GET BY CLASS
    List<ClassSession> getByClass(Integer classNumber);

    // 🔥 DELETE
    void deleteSession(Long id);
}