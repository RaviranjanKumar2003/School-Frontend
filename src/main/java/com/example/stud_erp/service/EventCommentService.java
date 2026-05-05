package com.example.stud_erp.service;

import com.example.stud_erp.entity.EventComment;
import com.example.stud_erp.repository.EventCommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventCommentService {

    @Autowired
    private EventCommentRepository repository;

    public void saveComment(EventComment dto) {

        EventComment c = new EventComment();

        c.setEventId(dto.getEventId());
        c.setStudentId(dto.getStudentId());
        c.setStudentName(dto.getStudentName());
        c.setStudentImage(dto.getStudentImage());
        c.setComment(dto.getComment());

        repository.save(c);
    }

    public List<EventComment> getByEvent(Long eventId) {
        return repository.findByEventId(eventId);
    }

    public void deleteComment(Long id, Long studentId) {

        EventComment c = repository.findById(id).orElseThrow();

        if (!c.getStudentId().equals(studentId)) {
            throw new RuntimeException("Not allowed");
        }

        repository.delete(c);
    }

    public void updateComment(Long id, Long studentId, String text) {

        EventComment c = repository.findById(id).orElseThrow();

        if (!c.getStudentId().equals(studentId)) {
            throw new RuntimeException("Not allowed");
        }

        c.setComment(text);
        repository.save(c);
    }
}