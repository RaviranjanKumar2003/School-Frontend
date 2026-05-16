package com.example.stud_erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subjectName;

    @Column(nullable = false)
    private Integer number = 0;

    // ⭐ CLASS LINK
    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    // ⭐ SCHOOL LINK (IMPORTANT FIX)
    private Long schoolId;

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public Integer getNumber() {
        return number;
    }

    public ClassEntity getClassEntity() {
        return classEntity;
    }

    public Long getSchoolId() {
        return schoolId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public void setClassEntity(ClassEntity classEntity) {
        this.classEntity = classEntity;
    }

    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }
}