package com.example.stud_erp.payload;

public class ResultDTO {

    private Long examId;
    private Long classId;
    private Long teacherId;
    private String subject;
    private int marks;
    private int totalMarks;
    private String status;
    private String grade;
    private String examType;

    public ResultDTO() {}

    public ResultDTO(Long examId, Long classId, Long teacherId, String subject, int marks, int totalMarks, String status, String grade, String examType) {
        this.examId = examId;
        this.classId = classId;
        this.teacherId = teacherId;
        this.subject = subject;
        this.marks = marks;
        this.totalMarks = totalMarks;
        this.status = status;
        this.grade = grade;
        this.examType=examType;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
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

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}