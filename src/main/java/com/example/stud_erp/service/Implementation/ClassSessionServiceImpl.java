package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.ClassSession;
import com.example.stud_erp.repository.ClassSessionRepository;
import com.example.stud_erp.service.ClassSessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassSessionServiceImpl implements ClassSessionService {

    @Autowired
    private ClassSessionRepository repo;

    // 🔥 CREATE
    @Override
    public ClassSession createSession(ClassSession session) {
        return repo.save(session);
    }

    // 🔥 GET ALL
    @Override
    public List<ClassSession> getAllSessions() {
        return repo.findAll();
    }

    // 🔥 GET BY CLASS
    @Override
    public List<ClassSession> getByClass(Integer classNumber) {
        return repo.findByClassNumber(classNumber);
    }

    // 🔥 DELETE
    @Override
    public void deleteSession(Long id) {
        repo.deleteById(id);
    }
}