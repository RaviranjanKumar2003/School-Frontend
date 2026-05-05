package com.example.stud_erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subjectName;

    // ✅ FIX: number field add
    @Column(nullable = false)
    private Integer number = 0;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    // ================= GETTERS & SETTERS =================

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
}