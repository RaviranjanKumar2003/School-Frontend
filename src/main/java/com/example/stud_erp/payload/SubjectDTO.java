package com.example.stud_erp.payload;

public class SubjectDTO {

    private Long id;
    private String subjectName;
    private Long classId;
    private Integer number; // ✅ ADD THIS

    // GETTERS

    public Long getId() {
        return id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public Long getClassId() {
        return classId;
    }

    public Integer getNumber() { // ✅ ADD
        return number;
    }

    // SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public void setNumber(Integer number) { // ✅ ADD
        this.number = number;
    }
}