package com.example.stud_erp.payload;

import lombok.Data;

@Data
public class SchoolAdminDto {

    // ================= BASIC INFO =================
    private Long id;

    private String name;

    private String username;

    private String password;

    private String email;

    private String phone;

    private String imageUrl;

    // ================= SCHOOL INFO =================
    private Long schoolId;

    private String schoolName;

    private String schoolCode;

    // ================= DEFAULT CONSTRUCTOR =================
    public SchoolAdminDto() {
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // ================= GET ID =================
    public Long getId() {
        return id;
    }

    // ================= SET ID =================
    public void setId(Long id) {
        this.id = id;
    }

    // ================= GET NAME =================
    public String getName() {
        return name;
    }

    // ================= SET NAME =================
    public void setName(String name) {
        this.name = name;
    }

    // ================= GET USERNAME =================
    public String getUsername() {
        return username;
    }

    // ================= SET USERNAME =================
    public void setUsername(String username) {
        this.username = username;
    }

    // ================= GET PASSWORD =================
    public String getPassword() {
        return password;
    }

    // ================= SET PASSWORD =================
    public void setPassword(String password) {
        this.password = password;
    }

    // ================= GET EMAIL =================
    public String getEmail() {
        return email;
    }

    // ================= SET EMAIL =================
    public void setEmail(String email) {
        this.email = email;
    }

    // ================= GET PHONE =================
    public String getPhone() {
        return phone;
    }

    // ================= SET PHONE =================
    public void setPhone(String phone) {
        this.phone = phone;
    }

    // ================= GET SCHOOL ID =================
    public Long getSchoolId() {
        return schoolId;
    }

    // ================= SET SCHOOL ID =================
    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }

    // ================= GET SCHOOL NAME =================
    public String getSchoolName() {
        return schoolName;
    }

    // ================= SET SCHOOL NAME =================
    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    // ================= GET SCHOOL CODE =================
    public String getSchoolCode() {
        return schoolCode;
    }

    // ================= SET SCHOOL CODE =================
    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    // ================= TO STRING =================
    @Override
    public String toString() {

        return "SchoolAdminDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", schoolId=" + schoolId +
                ", schoolName='" + schoolName + '\'' +
                ", schoolCode='" + schoolCode + '\'' +
                '}';
    }
}