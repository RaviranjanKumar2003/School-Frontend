package com.example.stud_erp.payload;

public class SubjectDTO {

    private Long id;
    private String subjectName;
    private Long classId;
    private Long schoolId;   // ⭐ IMPORTANT
    private Integer number;

    private String className;

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

    public Long getSchoolId() {
        return schoolId;
    }

    public Integer getNumber() {
        return number;
    }

    public String getClassName() {
        return className;
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

    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}