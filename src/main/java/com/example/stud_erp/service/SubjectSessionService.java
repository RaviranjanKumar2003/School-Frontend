package com.example.stud_erp.service;

import com.example.stud_erp.entity.SubjectSession;
import com.example.stud_erp.repository.SubjectSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectSessionService {

    @Autowired
    private SubjectSessionRepository subjectRepository;

    public List<SubjectSession> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Optional<SubjectSession> getSubjectById(Long id) {
        return subjectRepository.findById(id);
    }

    public SubjectSession addSubject(SubjectSession subject) {
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}
