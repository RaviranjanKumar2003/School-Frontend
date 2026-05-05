package com.example.stud_erp.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "results",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"studentId", "subject", "examId"} // 🔥 FIX
        )
)
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private String subject;
    private String publishStatus = "DRAFT"; // 🔥 NEW
    private Long examId;
    private Long classId;

    private int marks;
    private int totalMarks; // 🔥 NEW

    private Long professorId;

    private String status;
    private Double percentage;
    private String grade;
    public Result() {}

    public Result(Long studentId, String subject, int marks, int totalMarks, Long professorId){
        this.studentId = studentId;
        this.subject = subject;
        this.marks = marks;
        this.totalMarks = totalMarks;
        this.professorId = professorId;
    }

    // 🔹 AUTO CALCULATION
    @PrePersist
    @PreUpdate
    public void calculate() {

        // Status
        if (marks == 0) {
            this.status = "ABSENT";
        } else if (marks < 33) {
            this.status = "FAIL";
        } else {
            this.status = "PASS";
        }

        // Percentage
        if (totalMarks > 0) {
            this.percentage = (marks * 100.0) / totalMarks;
        } else {
            this.percentage = 0.0;
        }

        // Grade
        if (percentage >= 90) this.grade = "A+";
        else if (percentage >= 75) this.grade = "A";
        else if (percentage >= 60) this.grade = "B";
        else if (percentage >= 50) this.grade = "C";
        else this.grade = "D";
    }

    // getters setters (same as before)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getMarks() {
        return marks;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Long getProfessorId() {
        return professorId;
    }

    public void setProfessorId(Long professorId) {
        this.professorId = professorId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getPublishStatus() {
        return publishStatus;
    }

    public void setPublishStatus(String publishStatus) {
        this.publishStatus = publishStatus;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }
}