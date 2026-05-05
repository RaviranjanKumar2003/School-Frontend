package com.example.stud_erp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "recheck_requests")
public class RecheckRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Student Info
    private Long studentId;
    private String studentName;
    private String studentImage;

    private Long classId;
    private String subjectName;
    // 🔥 MULTIPLE SUBJECT SUPPORT
    @ElementCollection
    private List<String> subjects;

    // 🔹 Request Status
    // PENDING -> APPROVED -> COMPLETED / REJECTED
    private String status;

    // 🔹 Optional Reason
    private String reason;

    // 🔹 Teacher (who will recheck)
    private Long professorId;
    private Long examId;
    private String teacherRemark;
    private int oldMarks;
    private int totalMarks;
    private String examType;

    // 🔹 Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 🔹 Constructor
    public RecheckRequest() {
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    // 🔥 AUTO UPDATE TIME
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 🔹 Getters & Setters

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public List<String> getSubjects() {
        return subjects;
    }

    public String getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public Long getProfessorId() {
        return professorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setProfessorId(Long professorId) {
        this.professorId = professorId;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getStudentImage() {
        return studentImage;
    }

    public void setStudentImage(String studentImage) {
        this.studentImage = studentImage;
    }

    public String getTeacherRemark() {
        return teacherRemark;
    }

    public void setTeacherRemark(String teacherRemark) {
        this.teacherRemark = teacherRemark;
    }

    public int getOldMarks() {
        return oldMarks;
    }

    public void setOldMarks(int oldMarks) {
        this.oldMarks = oldMarks;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
    }
}