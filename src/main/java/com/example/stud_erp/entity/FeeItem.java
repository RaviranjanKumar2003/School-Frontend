package com.example.stud_erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fee_items")
public class FeeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 NEW FIELDS
    private String title;        // Tuition Fee
    private String description;  // Monthly tuition fee (Jan)

    @Column(nullable = false)
    private Double amount;

    @ManyToOne
    @JoinColumn(name = "student_fee_id")
    private StudentFee studentFee;



// GETTERS SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public StudentFee getStudentFee() { return studentFee; }
    public void setStudentFee(StudentFee studentFee) { this.studentFee = studentFee; }
}