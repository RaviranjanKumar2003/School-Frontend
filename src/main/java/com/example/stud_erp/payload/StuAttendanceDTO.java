//package com.example.stud_erp.payload;
//
//import lombok.Data;
//
//@Data
//public class StuAttendanceDTO {
//
//    private Long studentId;
//    private String studentName;
//    private String studentLastName; // ✅ ADD
//    private String email;           // ✅ ADD
//    private String status;
//    private Long studRollNo;
//
//// GETTERS & SETTERS
//
//
//    public String getStudentLastName() {
//        return studentLastName;
//    }
//
//    public void setStudentLastName(String studentLastName) {
//        this.studentLastName = studentLastName;
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
//    public Long getStudentId() {
//        return studentId;
//    }
//
//    public void setStudentId(Long studentId) {
//        this.studentId = studentId;
//    }
//
//    public String getStudentName() {
//        return studentName;
//    }
//
//    public void setStudentName(String studentName) {
//        this.studentName = studentName;
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
//    public Long getStudRollNo() {
//        return studRollNo;
//    }
//
//    public void setStudRollNo(Long studRollNo) {
//        this.studRollNo = studRollNo;
//    }
//}


package com.example.stud_erp.payload;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StuAttendanceDTO {

    // =====================================================
    // ATTENDANCE
    // =====================================================

    private Long attendanceId;

    private LocalDate attendanceDate;

    // P / A / L
    private String status;

    // =====================================================
    // SCHOOL
    // =====================================================

    private Long schoolId;

    private String schoolName;

    // =====================================================
    // CLASS
    // =====================================================

    private Long classId;

    private String className;

    // =====================================================
    // SECTION
    // =====================================================

    private String section;

    // =====================================================
    // QR ATTENDANCE
    // =====================================================

    private Boolean qrScanned;

    private LocalDate qrScanDate;

    // =====================================================
    // STUDENT
    // =====================================================

    private Long studentId;

    // Unique Student ID
    private String studentIdNumber;

    private String studentName;

    private String studentLastName;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Long studRollNo;

    private String gender;

    private String profileImage;

    private String qrCodeUrl;

    // =====================================================
    // CREATED BY
    // =====================================================

    private Long takenById;

    private String takenByName;

    private String takenByRole;

    // =====================================================
    // UPDATED BY
    // =====================================================

    private Long updatedById;

    private String updatedByName;

    private String updatedByRole;

    // =====================================================
    // TIMESTAMP
    // =====================================================

    private LocalDate createdDate;

    private LocalDate updatedDate;

    // =====================================================
    // GETTERS & SETTERS
    // =====================================================

    public Long getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(Long attendanceId) {
        this.attendanceId = attendanceId;
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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentIdNumber() {
        return studentIdNumber;
    }

    public void setStudentIdNumber(String studentIdNumber) {
        this.studentIdNumber = studentIdNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentLastName() {
        return studentLastName;
    }

    public void setStudentLastName(String studentLastName) {
        this.studentLastName = studentLastName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Long getStudRollNo() {
        return studRollNo;
    }

    public void setStudRollNo(Long studRollNo) {
        this.studRollNo = studRollNo;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }

    public Long getTakenById() {
        return takenById;
    }

    public void setTakenById(Long takenById) {
        this.takenById = takenById;
    }

    public String getTakenByName() {
        return takenByName;
    }

    public void setTakenByName(String takenByName) {
        this.takenByName = takenByName;
    }

    public String getTakenByRole() {
        return takenByRole;
    }

    public void setTakenByRole(String takenByRole) {
        this.takenByRole = takenByRole;
    }

    public Long getUpdatedById() {
        return updatedById;
    }

    public void setUpdatedById(Long updatedById) {
        this.updatedById = updatedById;
    }

    public String getUpdatedByName() {
        return updatedByName;
    }

    public void setUpdatedByName(String updatedByName) {
        this.updatedByName = updatedByName;
    }

    public String getUpdatedByRole() {
        return updatedByRole;
    }

    public void setUpdatedByRole(String updatedByRole) {
        this.updatedByRole = updatedByRole;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
    }
}