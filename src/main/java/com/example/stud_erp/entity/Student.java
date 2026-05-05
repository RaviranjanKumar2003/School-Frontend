//package com.example.stud_erp.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.Set;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "students", uniqueConstraints = {
//        @UniqueConstraint(columnNames = "studentId", name = "uk_students_student_id"),
//        @UniqueConstraint(columnNames = "username", name = "uk_students_username"),
//        @UniqueConstraint(columnNames = "email", name = "uk_students_email")
//})
//public class Student {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(unique = true, nullable = false, length = 20)
//    private String studentId;
//
//    @Column(unique = true, nullable = false)
//    private String username;
//
//    @Column(nullable = false)
//    private String password;
//
//    @Column(unique = true, nullable = false)
//    private String email;
//
//    @Column(nullable = false, length = 50)
//    private String major;
//
//    @Column(nullable = false)
//    private int year;
//
//    @Column(nullable = false, unique = true)
//    private Long studRollNo;
//
//    @Column(nullable = false, length = 50)
//    private String studName;
//
//    @Column(nullable = false, length = 50)
//    private String studFatherName;
//
//    @Column(nullable = false, length = 50)
//    private String studLastName;
//
//    @Column(nullable = false, length = 15)
//    private String studPhoneNumber;
//
//    @Column(nullable = false)
//    private LocalDate studentDob;
//
//    @Column(nullable = false, length = 30)
//    private String studCategory;
//
//    @Column(length = 30)
//    private String studCaste;
//
//    @Column(nullable = false)
//    private int studentAge;
//
//    @Column(length = 255)
//    private String imageUrl;
//
//    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "student")
//    @JsonIgnore
//    private Set<Semester> semesters;
//
//    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "student")
//    @JsonIgnore
//    private Set<Attendance> attendance;
//
//    @Column
//    private String otp;
//
//    @Column
//    private LocalDateTime otpExpiry;
//
//    @Column(nullable = false, updatable = false)
//    private LocalDateTime createdAt;
//
//    @Column
//    private LocalDateTime updatedAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    protected void onUpdate() {
//        updatedAt = LocalDateTime.now();
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
//    public String getStudentId() {
//        return studentId;
//    }
//
//    public void setStudentId(String studentId) {
//        this.studentId = studentId;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
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
//    public String getMajor() {
//        return major;
//    }
//
//    public void setMajor(String major) {
//        this.major = major;
//    }
//
//    public int getYear() {
//        return year;
//    }
//
//    public void setYear(int year) {
//        this.year = year;
//    }
//
//    public Long getStudRollNo() {
//        return studRollNo;
//    }
//
//    public void setStudRollNo(Long studRollNo) {
//        this.studRollNo = studRollNo;
//    }
//
//    public String getStudName() {
//        return studName;
//    }
//
//    public void setStudName(String studName) {
//        this.studName = studName;
//    }
//
//    public String getStudFatherName() {
//        return studFatherName;
//    }
//
//    public void setStudFatherName(String studFatherName) {
//        this.studFatherName = studFatherName;
//    }
//
//    public String getStudLastName() {
//        return studLastName;
//    }
//
//    public void setStudLastName(String studLastName) {
//        this.studLastName = studLastName;
//    }
//
//    public String getStudPhoneNumber() {
//        return studPhoneNumber;
//    }
//
//    public void setStudPhoneNumber(String studPhoneNumber) {
//        this.studPhoneNumber = studPhoneNumber;
//    }
//
//    public LocalDate getStudentDob() {
//        return studentDob;
//    }
//
//    public void setStudentDob(LocalDate studentDob) {
//        this.studentDob = studentDob;
//    }
//
//    public String getStudCategory() {
//        return studCategory;
//    }
//
//    public void setStudCategory(String studCategory) {
//        this.studCategory = studCategory;
//    }
//
//    public String getStudCaste() {
//        return studCaste;
//    }
//
//    public void setStudCaste(String studCaste) {
//        this.studCaste = studCaste;
//    }
//
//    public int getStudentAge() {
//        return studentAge;
//    }
//
//    public void setStudentAge(int studentAge) {
//        this.studentAge = studentAge;
//    }
//
//    public String getImageUrl() {
//        return imageUrl;
//    }
//
//    public void setImageUrl(String imageUrl) {
//        this.imageUrl = imageUrl;
//    }
//
//    public Set<Semester> getSemesters() {
//        return semesters;
//    }
//
//    public void setSemesters(Set<Semester> semesters) {
//        this.semesters = semesters;
//    }
//
//    public Set<Attendance> getAttendance() {
//        return attendance;
//    }
//
//    public void setAttendance(Set<Attendance> attendance) {
//        this.attendance = attendance;
//    }
//
//    public String getOtp() {
//        return otp;
//    }
//
//    public void setOtp(String otp) {
//        this.otp = otp;
//    }
//
//    public LocalDateTime getOtpExpiry() {
//        return otpExpiry;
//    }
//
//    public void setOtpExpiry(LocalDateTime otpExpiry) {
//        this.otpExpiry = otpExpiry;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public LocalDateTime getUpdatedAt() {
//        return updatedAt;
//    }
//
//    public void setUpdatedAt(LocalDateTime updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//}



//after update



//package com.example.stud_erp.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.Set;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(
//        name = "students",
//        uniqueConstraints = {
//                @UniqueConstraint(columnNames = "studentId", name = "uk_students_student_id"),
//                @UniqueConstraint(columnNames = "username", name = "uk_students_username"),
//                @UniqueConstraint(columnNames = "email", name = "uk_students_email")
//        }
//)
//public class Student {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    // 🔹 SCHOOL CODE (Frontend se aayega)
//    @Column(nullable = false, length = 20)
//    private String schoolCode;
//
//    // 🔹 REGISTRATION NUMBER (Auto generate)
//    @Column(nullable = false, unique = true, length = 30)
//    private String studentId;
//
//    // 🔹 LOGIN USERNAME
//    @Column(nullable = false, unique = true, length = 50)
//    private String username;
//
//    // 🔹 LOGIN PASSWORD
//    @Column(nullable = false)
//    private String password;
//
//    // 🔹 EMAIL
//    @Column(nullable = false, unique = true)
//    private String email;
//
//    // 🔹 COURSE / DEPARTMENT
//    @Column(nullable = false, length = 50)
//    private String major;
//
//    // 🔹 YEAR / SEMESTER
//    @Column(nullable = false)
//    private int year;
//
//    // 🔹 ROLL NUMBER
//    @Column(nullable = false, unique = true)
//    private Long studRollNo;
//
//    // 🔹 STUDENT NAME
//    @Column(nullable = false, length = 50)
//    private String studName;
//
//    // 🔹 FATHER NAME
//    @Column(nullable = false, length = 50)
//    private String studFatherName;
//
//    // 🔹 LAST NAME
//    @Column(nullable = false, length = 50)
//    private String studLastName;
//
//    // 🔹 PHONE
//    @Column(nullable = false, length = 15)
//    private String studPhoneNumber;
//
//    // 🔹 DATE OF BIRTH
//    @Column(nullable = false)
//    private LocalDate studentDob;
//
//    // 🔹 CATEGORY
//    @Column(nullable = false, length = 30)
//    private String studCategory;
//
//    // 🔹 CASTE
//    @Column(length = 30)
//    private String studCaste;
//
//    // 🔹 AGE
//    @Column(nullable = false)
//    private int studentAge;
//
//    // 🔹 PROFILE IMAGE
//    @Column(length = 255)
//    private String imageUrl;
//
//    // ===============================
//    // RELATIONS
//    // ===============================
//
//    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JsonIgnore
//    private Set<Semester> semesters;
//
//    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JsonIgnore
//    private Set<Attendance> attendance;
//
//    // ===============================
//    // OTP RESET PASSWORD
//    // ===============================
//
//    private String otp;
//
//    private LocalDateTime otpExpiry;
//
//    // ===============================
//    // AUDIT FIELDS
//    // ===============================
//
//    @Column(nullable = false, updatable = false)
//    private LocalDateTime createdAt;
//
//    private LocalDateTime updatedAt;
//
//    // ===============================
//    // AUTO TIMESTAMP
//    // ===============================
//
//    @PrePersist
//    protected void onCreate() {
//        this.createdAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    protected void onUpdate() {
//        this.updatedAt = LocalDateTime.now();
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
//    public String getSchoolCode() {
//        return schoolCode;
//    }
//
//    public void setSchoolCode(String schoolCode) {
//        this.schoolCode = schoolCode;
//    }
//
//    public String getStudentId() {
//        return studentId;
//    }
//
//    public void setStudentId(String studentId) {
//        this.studentId = studentId;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
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
//    public String getMajor() {
//        return major;
//    }
//
//    public void setMajor(String major) {
//        this.major = major;
//    }
//
//    public int getYear() {
//        return year;
//    }
//
//    public void setYear(int year) {
//        this.year = year;
//    }
//
//    public Long getStudRollNo() {
//        return studRollNo;
//    }
//
//    public void setStudRollNo(Long studRollNo) {
//        this.studRollNo = studRollNo;
//    }
//
//    public String getStudName() {
//        return studName;
//    }
//
//    public void setStudName(String studName) {
//        this.studName = studName;
//    }
//
//    public String getStudFatherName() {
//        return studFatherName;
//    }
//
//    public void setStudFatherName(String studFatherName) {
//        this.studFatherName = studFatherName;
//    }
//
//    public String getStudLastName() {
//        return studLastName;
//    }
//
//    public void setStudLastName(String studLastName) {
//        this.studLastName = studLastName;
//    }
//
//    public String getStudPhoneNumber() {
//        return studPhoneNumber;
//    }
//
//    public void setStudPhoneNumber(String studPhoneNumber) {
//        this.studPhoneNumber = studPhoneNumber;
//    }
//
//    public LocalDate getStudentDob() {
//        return studentDob;
//    }
//
//    public void setStudentDob(LocalDate studentDob) {
//        this.studentDob = studentDob;
//    }
//
//    public String getStudCategory() {
//        return studCategory;
//    }
//
//    public void setStudCategory(String studCategory) {
//        this.studCategory = studCategory;
//    }
//
//    public String getStudCaste() {
//        return studCaste;
//    }
//
//    public void setStudCaste(String studCaste) {
//        this.studCaste = studCaste;
//    }
//
//    public int getStudentAge() {
//        return studentAge;
//    }
//
//    public void setStudentAge(int studentAge) {
//        this.studentAge = studentAge;
//    }
//
//    public String getImageUrl() {
//        return imageUrl;
//    }
//
//    public void setImageUrl(String imageUrl) {
//        this.imageUrl = imageUrl;
//    }
//
//    public Set<Semester> getSemesters() {
//        return semesters;
//    }
//
//    public void setSemesters(Set<Semester> semesters) {
//        this.semesters = semesters;
//    }
//
//    public Set<Attendance> getAttendance() {
//        return attendance;
//    }
//
//    public void setAttendance(Set<Attendance> attendance) {
//        this.attendance = attendance;
//    }
//
//    public String getOtp() {
//        return otp;
//    }
//
//    public void setOtp(String otp) {
//        this.otp = otp;
//    }
//
//    public LocalDateTime getOtpExpiry() {
//        return otpExpiry;
//    }
//
//    public void setOtpExpiry(LocalDateTime otpExpiry) {
//        this.otpExpiry = otpExpiry;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public LocalDateTime getUpdatedAt() {
//        return updatedAt;
//    }
//
//    public void setUpdatedAt(LocalDateTime updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//}



//package com.example.stud_erp.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.Set;
//
//@Entity
//@Table(
//        name = "students",
//        uniqueConstraints = {
//                @UniqueConstraint(columnNames = "studentId"),
//                @UniqueConstraint(columnNames = "username"),
//                @UniqueConstraint(columnNames = "email")
//        }
//)
//public class Student {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String schoolCode;
//    private String studentId;
//    private String username;
//    private String password;
//    private String email;
//    private String major;
//    private int year;
//    private Long studRollNo;
//    private String studName;
//    private String studFatherName;
//    private String studLastName;
//    private String studPhoneNumber;
//    private LocalDate studentDob;
//    private String studCategory;
//    private String studCaste;
//    private int studentAge;
//    private String imageUrl;
//
//    // ✅ SOFT DELETE
//    private boolean isDeleted = false;
//
//    // ✅ OTP FIELDS (FIXED ERROR)
//    private String otp;
//    private LocalDateTime otpExpiry;
//
//    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
//    @JsonIgnore
//    private Set<Attendance> attendance;
//
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//
//    // ===============================
//    // AUTO TIMESTAMP
//    // ===============================
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    protected void onUpdate() {
//        updatedAt = LocalDateTime.now();
//    }
//
//    // ===============================
//    // GETTERS & SETTERS
//    // ===============================
//
//    public Long getId() {
//        return id;
//    }
//
//    public boolean isDeleted() {
//        return isDeleted;
//    }
//
//    public void setDeleted(boolean deleted) {
//        isDeleted = deleted;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getSchoolCode() {
//        return schoolCode;
//    }
//
//    public void setSchoolCode(String schoolCode) {
//        this.schoolCode = schoolCode;
//    }
//
//    public String getStudentId() {
//        return studentId;
//    }
//
//    public void setStudentId(String studentId) {
//        this.studentId = studentId;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
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
//    public String getMajor() {
//        return major;
//    }
//
//    public void setMajor(String major) {
//        this.major = major;
//    }
//
//    public int getYear() {
//        return year;
//    }
//
//    public void setYear(int year) {
//        this.year = year;
//    }
//
//    public Long getStudRollNo() {
//        return studRollNo;
//    }
//
//    public void setStudRollNo(Long studRollNo) {
//        this.studRollNo = studRollNo;
//    }
//
//    public String getStudName() {
//        return studName;
//    }
//
//    public void setStudName(String studName) {
//        this.studName = studName;
//    }
//
//    public String getStudFatherName() {
//        return studFatherName;
//    }
//
//    public void setStudFatherName(String studFatherName) {
//        this.studFatherName = studFatherName;
//    }
//
//    public String getStudLastName() {
//        return studLastName;
//    }
//
//    public void setStudLastName(String studLastName) {
//        this.studLastName = studLastName;
//    }
//
//    public String getStudPhoneNumber() {
//        return studPhoneNumber;
//    }
//
//    public void setStudPhoneNumber(String studPhoneNumber) {
//        this.studPhoneNumber = studPhoneNumber;
//    }
//
//    public LocalDate getStudentDob() {
//        return studentDob;
//    }
//
//    public void setStudentDob(LocalDate studentDob) {
//        this.studentDob = studentDob;
//    }
//
//    public String getStudCategory() {
//        return studCategory;
//    }
//
//    public void setStudCategory(String studCategory) {
//        this.studCategory = studCategory;
//    }
//
//    public String getStudCaste() {
//        return studCaste;
//    }
//
//    public void setStudCaste(String studCaste) {
//        this.studCaste = studCaste;
//    }
//
//    public int getStudentAge() {
//        return studentAge;
//    }
//
//    public void setStudentAge(int studentAge) {
//        this.studentAge = studentAge;
//    }
//
//    public String getImageUrl() {
//        return imageUrl;
//    }
//
//    public void setImageUrl(String imageUrl) {
//        this.imageUrl = imageUrl;
//    }
//
//    public Set<Attendance> getAttendance() {
//        return attendance;
//    }
//
//    public void setAttendance(Set<Attendance> attendance) {
//        this.attendance = attendance;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public LocalDateTime getUpdatedAt() {
//        return updatedAt;
//    }
//
//    public void setUpdatedAt(LocalDateTime updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//
//    // ===============================
//    // OTP GETTERS SETTERS
//    // ===============================
//
//    public String getOtp() {
//        return otp;
//    }
//
//    public void setOtp(String otp) {
//        this.otp = otp;
//    }
//
//    public LocalDateTime getOtpExpiry() {
//        return otpExpiry;
//    }
//
//    public void setOtpExpiry(LocalDateTime otpExpiry) {
//        this.otpExpiry = otpExpiry;
//    }
//}



// update for students



package com.example.stud_erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(
        name = "students",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "studentId"),
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        }
)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String schoolCode;
    private String studentId;
    private String username;
    private String password;
    private String email;

    // ✅ CHANGE: year ➝ classNumber
    private Integer classNumber;

    private String className;

    private Long studRollNo;
    private String studName;
    private String studFatherName;
    private String studLastName;
    private String studPhoneNumber;
    private LocalDate studentDob;
    private String studCategory;
    private String studCaste;
    private int studentAge;
    private String imageUrl;

    private boolean isDeleted = false;

    private String otp;
    private LocalDateTime otpExpiry;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Attendance> attendance;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ================= GETTERS SETTERS =================


    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSchoolCode() { return schoolCode; }
    public void setSchoolCode(String schoolCode) { this.schoolCode = schoolCode; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getClassNumber() {
        return classNumber;
    }

    public void setClassNumber(Integer classNumber) {
        this.classNumber = classNumber;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getStudRollNo() { return studRollNo; }
    public void setStudRollNo(Long studRollNo) { this.studRollNo = studRollNo; }

    public String getStudName() { return studName; }
    public void setStudName(String studName) { this.studName = studName; }

    public String getStudFatherName() { return studFatherName; }
    public void setStudFatherName(String studFatherName) { this.studFatherName = studFatherName; }

    public String getStudLastName() { return studLastName; }
    public void setStudLastName(String studLastName) { this.studLastName = studLastName; }

    public String getStudPhoneNumber() { return studPhoneNumber; }
    public void setStudPhoneNumber(String studPhoneNumber) { this.studPhoneNumber = studPhoneNumber; }

    public LocalDate getStudentDob() { return studentDob; }
    public void setStudentDob(LocalDate studentDob) { this.studentDob = studentDob; }

    public String getStudCategory() { return studCategory; }
    public void setStudCategory(String studCategory) { this.studCategory = studCategory; }

    public String getStudCaste() { return studCaste; }
    public void setStudCaste(String studCaste) { this.studCaste = studCaste; }

    public int getStudentAge() { return studentAge; }
    public void setStudentAge(int studentAge) { this.studentAge = studentAge; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }

    public Set<Attendance> getAttendance() { return attendance; }
    public void setAttendance(Set<Attendance> attendance) { this.attendance = attendance; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public LocalDateTime getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(LocalDateTime otpExpiry) { this.otpExpiry = otpExpiry; }
}