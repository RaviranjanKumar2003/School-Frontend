//package com.example.stud_erp.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import jakarta.persistence.*;
//import java.util.List;
//
//@Entity
//@Table(name = "professors")
//public class Professor {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String professorId;
//
//    private String name;
//    private String email;
//    private String phone;
//
//    private String designation;
//    private String qualification;
//    private String experience;
//    private String joiningDate;
//
//    private String username;
//    private String password;
//
//    private String imageUrl;
//    private String otp;
//
//    // 🔥 RELATION FIXED (IMPORTANT)
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "school_id")
//    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//    @JsonIgnore
//    private School school;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "hod_id")
//    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//    @JsonIgnore
//    private HOD hod;
//
//    @OneToMany(
//            mappedBy = "professor",
//            cascade = CascadeType.ALL,
//            orphanRemoval = true
//    )
//    @JsonIgnoreProperties({
//            "professor",
//            "hibernateLazyInitializer",
//            "handler"
//    })
//    private List<TeacherAssignment> assignments;
//
//    public Professor() {}
//
//    // GETTERS & SETTERS
//
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public String getProfessorId() { return professorId; }
//    public void setProfessorId(String professorId) { this.professorId = professorId; }
//
//    public String getName() { return name; }
//    public void setName(String name) { this.name = name; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public String getPhone() { return phone; }
//    public void setPhone(String phone) { this.phone = phone; }
//
//    public String getDesignation() { return designation; }
//    public void setDesignation(String designation) { this.designation = designation; }
//
//    public String getQualification() { return qualification; }
//    public void setQualification(String qualification) { this.qualification = qualification; }
//
//    public String getExperience() { return experience; }
//    public void setExperience(String experience) { this.experience = experience; }
//
//    public String getJoiningDate() { return joiningDate; }
//    public void setJoiningDate(String joiningDate) { this.joiningDate = joiningDate; }
//
//    public String getUsername() { return username; }
//    public void setUsername(String username) { this.username = username; }
//
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//
//    public String getImageUrl() { return imageUrl; }
//    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
//
//    public String getOtp() { return otp; }
//    public void setOtp(String otp) { this.otp = otp; }
//
//    public School getSchool() { return school; }
//    public void setSchool(School school) { this.school = school; }
//
//    public HOD getHod() { return hod; }
//    public void setHod(HOD hod) { this.hod = hod; }
//
//    public List<TeacherAssignment> getAssignments() { return assignments; }
//    public void setAssignments(List<TeacherAssignment> assignments) { this.assignments = assignments; }
//}



//================================================================================================== NEW

package com.example.stud_erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "professors")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String professorId;

    private String name;
    private String email;
    private String phone;

    private String designation;
    private String qualification;
    private String experience;
    private String joiningDate;

    private String username;
    private String password;

    private String imageUrl;
    private String otp;

    // ================= SCHOOL =================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private School school;

    // ================= SCHOOL ADMIN =================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_admin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonIgnore
    private SchoolAdmin schoolAdmin;

    // ================= ASSIGNMENTS =================
    @OneToMany(
            mappedBy = "professor",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnoreProperties({
            "professor",
            "hibernateLazyInitializer",
            "handler"
    })
    private List<TeacherAssignment> assignments;

    public Professor() {}

    // ================= GETTERS SETTERS =================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProfessorId() {
        return professorId;
    }

    public void setProfessorId(String professorId) {
        this.professorId = professorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(String joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public SchoolAdmin getSchoolAdmin() {
        return schoolAdmin;
    }

    public void setSchoolAdmin(SchoolAdmin schoolAdmin) {
        this.schoolAdmin = schoolAdmin;
    }

    public List<TeacherAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<TeacherAssignment> assignments) {
        this.assignments = assignments;
    }
}