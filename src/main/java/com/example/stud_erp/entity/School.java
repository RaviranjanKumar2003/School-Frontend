package com.example.stud_erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "schools")
public class School {

    // ================= ID =================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= BASIC INFO =================
    private String schoolName;

    @Column(unique = true)
    private String schoolCode;

    private String address;

    private String email;

    private String phone;

    // ================= AUDIT =================
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ================= SCHOOL ADMIN =================
    @OneToOne(
            mappedBy = "school",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )

    @JsonIgnoreProperties({
            "school",
            "hibernateLazyInitializer",
            "handler"
    })

    private SchoolAdmin schoolAdmin;
    // ================= HODS =================
    @OneToMany(
            mappedBy = "school",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )

    @JsonIgnoreProperties({
            "school",
            "hibernateLazyInitializer",
            "handler"
    })

    private List<HOD> hods = new ArrayList<>();

    // ================= LIFECYCLE =================
    @PrePersist
    public void onCreate() {

        createdAt = LocalDateTime.now();

        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {

        updatedAt = LocalDateTime.now();
    }

    // ================= COVER IMAGES =================
    @ElementCollection
    @CollectionTable(
            name = "school_cover_images",
            joinColumns = @JoinColumn(name = "school_id")
    )
    @Column(name = "image")
    private List<String> coverImages;

// ================= GETTERS & SETTERS =================


    public List<String> getCoverImages() {
        return coverImages;
    }

    public void setCoverImages(List<String> coverImages) {
        this.coverImages = coverImages;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public SchoolAdmin getSchoolAdmin() {
        return schoolAdmin;
    }

    public void setSchoolAdmin(SchoolAdmin schoolAdmin) {
        this.schoolAdmin = schoolAdmin;
    }

    public List<HOD> getHods() {
        return hods;
    }

    public void setHods(List<HOD> hods) {
        this.hods = hods;
    }
}