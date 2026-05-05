package com.example.stud_erp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exam_notices")
public class ExamNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Transient
    private List<Long> ids;

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }

    private Long classId;

    private String examType; // FINAL / PRACTICAL

    private String subjectName;

    private Long teacherId;

    private String message;

    private String status; // CREATED

    private LocalDateTime createdAt = LocalDateTime.now();

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }

    public Long getClassId() { return classId; }

    public String getExamType() { return examType; }

    public String getSubjectName() { return subjectName; }

    public Long getTeacherId() { return teacherId; }

    public String getMessage() { return message; }

    public String getStatus() { return status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }

    public void setClassId(Long classId) { this.classId = classId; }

    public void setExamType(String examType) { this.examType = examType; }

    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public void setMessage(String message) { this.message = message; }

    public void setStatus(String status) { this.status = status; }
}