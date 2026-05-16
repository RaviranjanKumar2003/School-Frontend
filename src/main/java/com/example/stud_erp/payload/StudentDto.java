//package com.example.stud_erp.payload;
//
//import java.time.LocalDate;
//
//public class StudentDTO {
//
//    private Long id;
//
//    // ================= SCHOOL =================
//    private Long schoolId;
//    private String schoolCode;
//    private String schoolName;
//
//    // ================= STUDENT =================
//    private String studentId;
//    private String username;
//    private String email;
//
//    private Long classNumber;
//    private String className;
//
//    private Long studRollNo;
//    private String studName;
//    private String studFatherName;
//    private String studLastName;
//    private String studPhoneNumber;
//
//    private LocalDate studentDob;
//    private String studCategory;
//    private String studCaste;
//    private int studentAge;
//
//    private String imageUrl;
//
//    // optional
//    private StudentFeeDTO fee;
//
//
//
// // GETTERS & SETTERS
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
//    public Long getSchoolId() {
//        return schoolId;
//    }
//
//    public void setSchoolId(Long schoolId) {
//        this.schoolId = schoolId;
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
//    public String getSchoolName() {
//        return schoolName;
//    }
//
//    public void setSchoolName(String schoolName) {
//        this.schoolName = schoolName;
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
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public Long getClassNumber() {
//        return classNumber;
//    }
//
//    public void setClassNumber(Long classNumber) {
//        this.classNumber = classNumber;
//    }
//
//    public String getClassName() {
//        return className;
//    }
//
//    public void setClassName(String className) {
//        this.className = className;
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
//    public StudentFeeDTO getFee() {
//        return fee;
//    }
//
//    public void setFee(StudentFeeDTO fee) {
//        this.fee = fee;
//    }
//}



//===================================================================================== NEW

package com.example.stud_erp.payload;

import com.example.stud_erp.enums.StudentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class StudentDto {

    // ================= PRIMARY KEY =================

    private Long id;

    // ================= LOGIN INFO =================

    private String studentId;

    private String username;

    private String password;

    private String email;

    // ================= ADMISSION INFO =================

    private LocalDate admissionDate;

    private StudentStatus status;

    // ================= ACADEMIC INFO =================

    private Long classId;

    private String className;

    private String section;

    private Long studRollNo;

    // ================= PERSONAL INFO =================

    private String studfirstName;

    private String studlastName;

    private String fullName;

    private String studFatherName;

    private String gender;

    private LocalDate studentDob;

    private Integer studentAge;

    private String bloodGroup;

    private String religion;

    private String nationality;

    private String studCategory;

    private String studCaste;

    private String aadhaarNumber;

    // ================= CONTACT INFO =================

    private String studPhoneNumber;

    private String fatherPhone;

    private String fatherEmail;

    private String motherName;

    private String motherPhone;

    // ================= ADDRESS =================

    private String address;

    private String city;

    private String state;

    private String pincode;

    // ================= SCHOOL EXTRA INFO =================

    private String previousSchool;

    private Double monthlyFee;

    private boolean discountedStudent;

    // ================= TRANSPORT =================

    private boolean transportRequired;

    private String pickupPoint;

    private String assignedBusRoute;

    // ================= PARENT ACCOUNT =================

    private boolean createParentAccount;

    // ================= IMAGE =================

    private String profileImage;

    // ================= QR CODE =================

    private String qrCodeUrl;

    // ================= SYSTEM =================

    private boolean isDeleted;

    private Long createdBy;

    private Long updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ================= SCHOOL =================

    private Long schoolId;

    private String schoolName;



// ================= GETTERS & SETTERS =================


    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public StudentStatus getStatus() {
        return status;
    }

    public void setStatus(StudentStatus status) {
        this.status = status;
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

    public Long getStudRollNo() {
        return studRollNo;
    }

    public void setStudRollNo(Long studRollNo) {
        this.studRollNo = studRollNo;
    }

    public String getStudfirstName() {
        return studfirstName;
    }

    public void setStudfirstName(String studfirstName) {
        this.studfirstName = studfirstName;
    }

    public String getStudlastName() {
        return studlastName;
    }

    public void setStudlastName(String studlastName) {
        this.studlastName = studlastName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStudFatherName() {
        return studFatherName;
    }

    public void setStudFatherName(String studFatherName) {
        this.studFatherName = studFatherName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getStudentDob() {
        return studentDob;
    }

    public void setStudentDob(LocalDate studentDob) {
        this.studentDob = studentDob;
    }

    public Integer getStudentAge() {
        return studentAge;
    }

    public void setStudentAge(Integer studentAge) {
        this.studentAge = studentAge;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getStudCategory() {
        return studCategory;
    }

    public void setStudCategory(String studCategory) {
        this.studCategory = studCategory;
    }

    public String getStudCaste() {
        return studCaste;
    }

    public void setStudCaste(String studCaste) {
        this.studCaste = studCaste;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getStudPhoneNumber() {
        return studPhoneNumber;
    }

    public void setStudPhoneNumber(String studPhoneNumber) {
        this.studPhoneNumber = studPhoneNumber;
    }

    public String getFatherPhone() {
        return fatherPhone;
    }

    public void setFatherPhone(String fatherPhone) {
        this.fatherPhone = fatherPhone;
    }

    public String getFatherEmail() {
        return fatherEmail;
    }

    public void setFatherEmail(String fatherEmail) {
        this.fatherEmail = fatherEmail;
    }

    public String getMotherName() {
        return motherName;
    }

    public void setMotherName(String motherName) {
        this.motherName = motherName;
    }

    public String getMotherPhone() {
        return motherPhone;
    }

    public void setMotherPhone(String motherPhone) {
        this.motherPhone = motherPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getPreviousSchool() {
        return previousSchool;
    }

    public void setPreviousSchool(String previousSchool) {
        this.previousSchool = previousSchool;
    }

    public Double getMonthlyFee() {
        return monthlyFee;
    }

    public void setMonthlyFee(Double monthlyFee) {
        this.monthlyFee = monthlyFee;
    }

    public boolean isDiscountedStudent() {
        return discountedStudent;
    }

    public void setDiscountedStudent(boolean discountedStudent) {
        this.discountedStudent = discountedStudent;
    }

    public boolean isTransportRequired() {
        return transportRequired;
    }

    public void setTransportRequired(boolean transportRequired) {
        this.transportRequired = transportRequired;
    }

    public String getPickupPoint() {
        return pickupPoint;
    }

    public void setPickupPoint(String pickupPoint) {
        this.pickupPoint = pickupPoint;
    }

    public String getAssignedBusRoute() {
        return assignedBusRoute;
    }

    public void setAssignedBusRoute(String assignedBusRoute) {
        this.assignedBusRoute = assignedBusRoute;
    }

    public boolean isCreateParentAccount() {
        return createParentAccount;
    }

    public void setCreateParentAccount(boolean createParentAccount) {
        this.createParentAccount = createParentAccount;
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

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
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
}