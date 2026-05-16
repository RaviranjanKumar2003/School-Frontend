//package com.example.stud_erp.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDate;
//
//@Entity
//@Table(name = "teacher_attendance")
//public class TeacherAttendance {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private Long schoolId;   // 🔥 IMPORTANT (missing earlier)
//
//    @Column(name = "teacher_id")
//    private Long teacherId;
//
//    private String status; // P / A
//
//    private LocalDate date;
//
//    private Long createdBy;
//
//    private String createdByRole;
//
//    private String createdByName;
//
//
//// GETTERS & SETTERS
//
//
//    public String getCreatedByName() {
//        return createdByName;
//    }
//
//    public void setCreatedByName(String createdByName) {
//        this.createdByName = createdByName;
//    }
//
//    public Long getCreatedBy() {
//        return createdBy;
//    }
//
//    public void setCreatedBy(Long createdBy) {
//        this.createdBy = createdBy;
//    }
//
//    public String getCreatedByRole() {
//        return createdByRole;
//    }
//
//    public void setCreatedByRole(String createdByRole) {
//        this.createdByRole = createdByRole;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Long getSchoolId() {
//        return schoolId;
//    }
//
//    public void setSchoolId(Long schoolId) {
//        this.schoolId = schoolId;
//    }
//
//    public Long getTeacherId() {
//        return teacherId;
//    }
//
//    public void setTeacherId(Long teacherId) {
//        this.teacherId = teacherId;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public LocalDate getDate() {
//        return date;
//    }
//
//    public void setDate(LocalDate date) {
//        this.date = date;
//    }
//}



//=========================================================================================== NEW

package com.example.stud_erp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "teacher_attendance")

public class TeacherAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= BASIC =================

    private Long schoolId;

    private Long teacherId;

    private String status;

    // 🔥 ATTENDANCE DATE
    private LocalDate attendanceDate;

    // ================= CREATED =================

    private LocalDate createdDate;

    private Long createdBy;

    private String createdByRole;

    private String createdByName;

    // ================= UPDATED =================

    private Long updatedBy;

    private String updatedByRole;

    private String updatedByName;

    private LocalDate updatedDate;

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public String getCreatedByRole() {
        return createdByRole;
    }

    public void setCreatedByRole(String createdByRole) {
        this.createdByRole = createdByRole;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getUpdatedByRole() {
        return updatedByRole;
    }

    public void setUpdatedByRole(String updatedByRole) {
        this.updatedByRole = updatedByRole;
    }

    public String getUpdatedByName() {
        return updatedByName;
    }

    public void setUpdatedByName(String updatedByName) {
        this.updatedByName = updatedByName;
    }

    public LocalDate getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
    }
}