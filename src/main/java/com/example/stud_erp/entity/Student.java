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
//    // ================= SCHOOL INFO =================
//    private Long schoolId;
//    private String schoolCode;
//    private String schoolName;
//
//    // ================= STUDENT INFO =================
//    private String studentId;
//    private String username;
//    private String password;
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
//    private boolean isDeleted = false;
//
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
//    @PrePersist
//    void onCreate() {
//
//        createdAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    void onUpdate() {
//
//        updatedAt = LocalDateTime.now();
//    }
//
//
//
//// GETTERS & SETTERS
//
//}


//================================================================================== NEW

package com.example.stud_erp.entity;

import com.example.stud_erp.enums.StudentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Set;

@Entity
@Table(
        name = "students",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "studentId"),
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email"),
                @UniqueConstraint(columnNames = "admissionNumber")
        }
)
public class Student {

    // ================= PRIMARY KEY =================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= LOGIN INFO =================

    @Column(nullable = false, unique = true)
    private String studentId;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonIgnore
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    // ================= ADMISSION INFO =================

    private LocalDate admissionDate;

    @Enumerated(EnumType.STRING)
    private StudentStatus status = StudentStatus.ACTIVE;

    // ================= ACADEMIC INFO =================

    private String className;

    private String section;

    private Long studRollNo;

    // ================= PERSONAL INFO =================

    @Column(nullable = false)
    private String studfirstName;

    private String studlastName;

    @Transient
    public String getFullName() {

        if (studlastName == null || studlastName.isBlank()) {
            return studfirstName;
        }

        return studfirstName + " " + studlastName;
    }

    @Transient
    private Integer studentAge;



    private String studFatherName;

    private String gender;

    private LocalDate studentDob;

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

    @Column(length = 1000)
    private String address;

    private String city;

    private String state;

    private String pincode;

    // ================= SCHOOL EXTRA INFO =================

    private String previousSchool;

    private Double monthlyFee;

    private boolean discountedStudent = false;

    // ================= TRANSPORT =================

    private boolean transportRequired = false;

    private String pickupPoint;

    private String assignedBusRoute;

    // ================= PARENT ACCOUNT =================

    private boolean createParentAccount = false;

    // ================= IMAGE =================

    private String profileImage;

    // ================= OTP =================

    @JsonIgnore
    private String otp;

    @JsonIgnore
    private LocalDateTime otpExpiry;

    // ================= SYSTEM =================

    private boolean isDeleted = false;

    private Long createdBy;

    private Long updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String qrCodeUrl;

    // ================= RELATIONS =================

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    private Set<Attendance> attendance;

    // ================= AUTO TIMESTAMP =================

    @PrePersist
    void onCreate() {

        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {

        updatedAt = LocalDateTime.now();
    }

    // ================= CALCULATED AGE =================

    @Transient
    public int getStudentAge() {

        if (studentDob == null) {
            return 0;
        }

        return Period.between(studentDob, LocalDate.now()).getYears();
    }

    //=============== Extra

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;



// ================= GETTERS & SETTERS =================


    public void setStudentAge(Integer studentAge) {
        this.studentAge = studentAge;
    }

    public ClassEntity getClassEntity() {
        return classEntity;
    }

    public void setClassEntity(ClassEntity classEntity) {
        this.classEntity = classEntity;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
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

    public String getAssignedBusRoute() {
        return assignedBusRoute;
    }

    public void setAssignedBusRoute(String assignedBusRoute) {
        this.assignedBusRoute = assignedBusRoute;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
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

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Set<Attendance> getAttendance() {
        return attendance;
    }

    public void setAttendance(Set<Attendance> attendance) {
        this.attendance = attendance;
    }
}

