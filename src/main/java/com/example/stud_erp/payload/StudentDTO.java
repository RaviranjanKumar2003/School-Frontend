//package com.example.stud_erp.payload;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@NoArgsConstructor
//@AllArgsConstructor
//@Data
//public class StudentDTO {
//
//    private Long id;
//    private String studentId;
//    private String major;
//    private int year;
//    private Long studRollNo;
//    private String studName;
//    private String username;
//    private String email;
//    private String StudPhoneNumber;
//    private LocalDate studentDob;
//    private String studFatherName;
//    private String studLastName;
//    private String studCategory;
//    private String studCaste;
//    private int studentAge;
//    private String imageUrl;
//    private List<SemesterDTO> semesters; // Semester performance
//    private List<AttendanceDTO> attendance; // Attendance details
//
//    public StudentDTO(Long id, String studName) {
//    }
//
//
//    public StudentDTO(Long id, String studentId, String major, int year, Long studRollNo, String studName, String username, String email, String studPhoneNumber, LocalDate studentDob, String studFatherName, String studLastName, String studCategory, String studCaste, int studentAge, String imageUrl, List<SemesterDTO> semesters, List<AttendanceDTO> attendance) {
//        this.id = id;
//        this.studentId = studentId;
//        this.major = major;
//        this.year = year;
//        this.studRollNo = studRollNo;
//        this.studName = studName;
//        this.username = username;
//        this.email = email;
//        StudPhoneNumber = studPhoneNumber;
//        this.studentDob = studentDob;
//        this.studFatherName = studFatherName;
//        this.studLastName = studLastName;
//        this.studCategory = studCategory;
//        this.studCaste = studCaste;
//        this.studentAge = studentAge;
//        this.imageUrl = imageUrl;
//        this.semesters = semesters;
//        this.attendance = attendance;
//    }
//
//    public StudentDTO() {
//
//    }
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
//    public String getStudentId() {
//        return studentId;
//    }
//
//    public void setStudentId(String studentId) {
//        this.studentId = studentId;
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
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
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
//    public String getStudPhoneNumber() {
//        return StudPhoneNumber;
//    }
//
//    public void setStudPhoneNumber(String studPhoneNumber) {
//        StudPhoneNumber = studPhoneNumber;
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
//    public List<SemesterDTO> getSemesters() {
//        return semesters;
//    }
//
//    public void setSemesters(List<SemesterDTO> semesters) {
//        this.semesters = semesters;
//    }
//
//    public List<AttendanceDTO> getAttendance() {
//        return attendance;
//    }
//
//    public void setAttendance(List<AttendanceDTO> attendance) {
//        this.attendance = attendance;
//    }
//}
//






//package com.example.stud_erp.payload;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public class StudentDTO {
//
//    private Long id;
//    private String studentId;
//    private String major;
//    private int year;
//    private Long studRollNo;
//    private String studName;
//    private String username;
//    private String email;
//    private String StudPhoneNumber;
//    private LocalDate studentDob;
//    private String studFatherName;
//    private String studLastName;
//    private String studCategory;
//    private String studCaste;
//    private int studentAge;
//    private String imageUrl;
//    private List<SemesterDTO> semesters;
//    private List<AttendanceDTO> attendance;
//
//    public StudentDTO() {
//    }
//
//    public StudentDTO(Long id, String studName) {
//        this.id = id;
//        this.studName = studName;
//    }
//
//    public StudentDTO(Long id, String studentId, String major, int year, Long studRollNo, String studName, String username, String email, String studPhoneNumber, LocalDate studentDob, String studFatherName, String studLastName, String studCategory, String studCaste, int studentAge, String imageUrl, List<SemesterDTO> semesters, List<AttendanceDTO> attendance) {
//        this.id = id;
//        this.studentId = studentId;
//        this.major = major;
//        this.year = year;
//        this.studRollNo = studRollNo;
//        this.studName = studName;
//        this.username = username;
//        this.email = email;
//        StudPhoneNumber = studPhoneNumber;
//        this.studentDob = studentDob;
//        this.studFatherName = studFatherName;
//        this.studLastName = studLastName;
//        this.studCategory = studCategory;
//        this.studCaste = studCaste;
//        this.studentAge = studentAge;
//        this.imageUrl = imageUrl;
//        this.semesters = semesters;
//        this.attendance = attendance;
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
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
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
//    public String getStudPhoneNumber() {
//        return StudPhoneNumber;
//    }
//
//    public void setStudPhoneNumber(String studPhoneNumber) {
//        StudPhoneNumber = studPhoneNumber;
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
//    public List<SemesterDTO> getSemesters() {
//        return semesters;
//    }
//
//    public void setSemesters(List<SemesterDTO> semesters) {
//        this.semesters = semesters;
//    }
//
//    public List<AttendanceDTO> getAttendance() {
//        return attendance;
//    }
//
//    public void setAttendance(List<AttendanceDTO> attendance) {
//        this.attendance = attendance;
//    }
//}


//update for school sms


package com.example.stud_erp.payload;

import java.time.LocalDate;
import java.util.List;

public class StudentDTO {

    private Long id;
    private String studentId;

    // ✅ CHANGE: year → classNumber
    private int classNumber;
    private String className;

    private Long studRollNo;
    private String studName;
    private String username;
    private String email;
    private String studPhoneNumber;
    private LocalDate studentDob;
    private String studFatherName;
    private String studLastName;
    private String studCategory;
    private String studCaste;
    private int studentAge;
    private String imageUrl;

    private List<SemesterDTO> semesters;
    private List<AttendanceDTO> attendance;

    private StudentFeeDTO fee;


    public StudentDTO() {
    }

    public StudentDTO(Long id, String studName) {
        this.id = id;
        this.studName = studName;
    }

    public StudentDTO(Long id, String studentId, String major, int classNumber,
                      Long studRollNo, String studName, String username,
                      String email, String studPhoneNumber, LocalDate studentDob,
                      String studFatherName, String studLastName,
                      String studCategory, String studCaste,
                      int studentAge, String imageUrl,
                      List<SemesterDTO> semesters,
                      List<AttendanceDTO> attendance) {

        this.id = id;
        this.studentId = studentId;
        this.classNumber = classNumber;
        this.studRollNo = studRollNo;
        this.studName = studName;
        this.username = username;
        this.email = email;
        this.studPhoneNumber = studPhoneNumber;
        this.studentDob = studentDob;
        this.studFatherName = studFatherName;
        this.studLastName = studLastName;
        this.studCategory = studCategory;
        this.studCaste = studCaste;
        this.studentAge = studentAge;
        this.imageUrl = imageUrl;
        this.semesters = semesters;
        this.attendance = attendance;
    }

    // ================= GETTERS SETTERS =================


    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public StudentFeeDTO getFee() {
        return fee;
    }

    public void setFee(StudentFeeDTO fee) {
        this.fee = fee;
    }

    public int getYear() {
        return year;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    // ✅ UPDATED
    public int getClassNumber() { return classNumber; }
    public void setClassNumber(int classNumber) { this.classNumber = classNumber; }

    public Long getStudRollNo() { return studRollNo; }
    public void setStudRollNo(Long studRollNo) { this.studRollNo = studRollNo; }

    public String getStudName() { return studName; }
    public void setStudName(String studName) { this.studName = studName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStudPhoneNumber() { return studPhoneNumber; }
    public void setStudPhoneNumber(String studPhoneNumber) { this.studPhoneNumber = studPhoneNumber; }

    public LocalDate getStudentDob() { return studentDob; }
    public void setStudentDob(LocalDate studentDob) { this.studentDob = studentDob; }

    public String getStudFatherName() { return studFatherName; }
    public void setStudFatherName(String studFatherName) { this.studFatherName = studFatherName; }

    public String getStudLastName() { return studLastName; }
    public void setStudLastName(String studLastName) { this.studLastName = studLastName; }

    public String getStudCategory() { return studCategory; }
    public void setStudCategory(String studCategory) { this.studCategory = studCategory; }

    public String getStudCaste() { return studCaste; }
    public void setStudCaste(String studCaste) { this.studCaste = studCaste; }

    public int getStudentAge() { return studentAge; }
    public void setStudentAge(int studentAge) { this.studentAge = studentAge; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<SemesterDTO> getSemesters() { return semesters; }
    public void setSemesters(List<SemesterDTO> semesters) { this.semesters = semesters; }

    public List<AttendanceDTO> getAttendance() { return attendance; }
    public void setAttendance(List<AttendanceDTO> attendance) { this.attendance = attendance; }

    private int year;

    public void setYear(int year) {
        this.year = year;
    }
}