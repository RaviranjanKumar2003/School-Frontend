//package com.example.stud_erp.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDate;
//
//@Entity
//@Data
//@Table(
//        uniqueConstraints = @UniqueConstraint(
//                columnNames = {"student_id", "classNumber", "date"}
//        )
//)
//public class StuAttendance {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private Integer classNumber;
//
//    private LocalDate date;
//
//    private String status; // P / A
//
//    @ManyToOne
//    @JoinColumn(name = "student_id", nullable = false)
//    private Student student;
//
//    // ================= NEW FIELDS 🔥 =================
//
//    private Long takenById;        // HOD ya Teacher ID
//
//    private String takenByName;   // Name store kar lo (fast access)
//
//    private String takenByRole;   // "HOD" / "TEACHER"
//
//// GETTERS & SETTERS
//
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Integer getClassNumber() {
//        return classNumber;
//    }
//
//    public void setClassNumber(Integer classNumber) {
//        this.classNumber = classNumber;
//    }
//
//    public LocalDate getDate() {
//        return date;
//    }
//
//    public void setDate(LocalDate date) {
//        this.date = date;
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
//    public Student getStudent() {
//        return student;
//    }
//
//    public void setStudent(Student student) {
//        this.student = student;
//    }
//
//    public Long getTakenById() {
//        return takenById;
//    }
//
//    public void setTakenById(Long takenById) {
//        this.takenById = takenById;
//    }
//
//    public String getTakenByName() {
//        return takenByName;
//    }
//
//    public void setTakenByName(String takenByName) {
//        this.takenByName = takenByName;
//    }
//
//    public String getTakenByRole() {
//        return takenByRole;
//    }
//
//    public void setTakenByRole(String takenByRole) {
//        this.takenByRole = takenByRole;
//    }
//}



package com.example.stud_erp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "stu_attendance",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "student_id",
                        "class_id",
                        "section",
                        "attendance_date"
                }
        )
)
public class StuAttendance {

    // =====================================================
    // ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // SCHOOL
    // =====================================================

    private Long schoolId;

    private String schoolName;

    // =====================================================
    // CLASS
    // =====================================================

    @Column(name = "class_id")
    private Long classId;

    private String className;

    // =====================================================
    // SECTION
    // =====================================================

    private String section;

    // =====================================================
    // ATTENDANCE DATE
    // =====================================================

    @Column(name = "attendance_date")
    private LocalDate attendanceDate;

    // =====================================================
    // STATUS
    // =====================================================

    // P = Present
    // A = Absent
    // L = Leave

    private String status;

    // =====================================================
    // QR INFO
    // =====================================================

    private Boolean qrScanned = false;

    private LocalDate qrScanDate;

    // =====================================================
    // STUDENT RELATION
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    // =====================================================
    // CREATED INFO
    // =====================================================

    private LocalDate createdDate;

    private Long createdBy;

    private String createdByRole;

    private String createdByName;

    // =====================================================
    // UPDATED INFO
    // =====================================================

    private Long updatedBy;

    private String updatedByRole;

    private String updatedByName;

    private LocalDate updatedDate;

    // =====================================================
    // CONSTRUCTORS
    // =====================================================

    public StuAttendance() {
    }

    // =====================================================
    // GETTERS & SETTERS
    // =====================================================

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

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getQrScanned() {
        return qrScanned;
    }

    public void setQrScanned(Boolean qrScanned) {
        this.qrScanned = qrScanned;
    }

    public LocalDate getQrScanDate() {
        return qrScanDate;
    }

    public void setQrScanDate(LocalDate qrScanDate) {
        this.qrScanDate = qrScanDate;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
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