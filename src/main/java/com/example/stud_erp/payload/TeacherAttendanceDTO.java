//package com.example.stud_erp.payload;
//
//import java.time.LocalDate;
//
//public class TeacherAttendanceDTO {
//
//    private Long id;
//
//    private Long teacherId;
//
//    private Long schoolId;
//
//    private String teacherName;
//
//    private String email;
//
//    private String status;
//
//    private LocalDate date;
//
//    private Long createdBy;
//
//    private String createdByRole;
//
//    private String createdByName;
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
//    public Long getSchoolId() {
//        return schoolId;
//    }
//
//    public void setSchoolId(Long schoolId) {
//        this.schoolId = schoolId;
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
//    public Long getTeacherId() {
//        return teacherId;
//    }
//
//    public void setTeacherId(Long teacherId) {
//        this.teacherId = teacherId;
//    }
//
//    public String getTeacherName() {
//        return teacherName;
//    }
//
//    public void setTeacherName(String teacherName) {
//        this.teacherName = teacherName;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
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


//============================================================================================= NEW

package com.example.stud_erp.payload;

import java.time.LocalDate;

public class TeacherAttendanceDTO {

    private Long id;

    private Long schoolId;

    private Long teacherId;

    private String teacherName;

    private String email;

    private String status;

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

    // 🔥 FOR FRONTEND CONFIRM MESSAGE
    private boolean alreadyExists;

    private String message;

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

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public boolean isAlreadyExists() {
        return alreadyExists;
    }

    public void setAlreadyExists(boolean alreadyExists) {
        this.alreadyExists = alreadyExists;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}