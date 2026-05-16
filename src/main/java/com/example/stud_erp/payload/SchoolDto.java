package com.example.stud_erp.payload;

import lombok.Data;

import java.util.List;

@Data
public class SchoolDto {

    // ================= SCHOOL INFO =================
    private Long id;

    private String schoolName;

    private String schoolCode;

    private String address;

    private String email;

    private String phone;

    // ================= SCHOOL ADMIN =================
    private SchoolAdminDto schoolAdmin;

    private List<String> coverImages;

    // ================= HODS =================
    private List<HODDto> hods;




    // ================= DEFAULT CONSTRUCTOR =================
    public SchoolDto() {
    }

    public List<String> getCoverImages() {
        return coverImages;
    }

    public void setCoverImages(List<String> coverImages) {
        this.coverImages = coverImages;
    }

    // ================= GET ID =================
    public Long getId() {
        return id;
    }

    // ================= SET ID =================
    public void setId(Long id) {
        this.id = id;
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

    // ================= GET ADDRESS =================
    public String getAddress() {
        return address;
    }

    // ================= SET ADDRESS =================
    public void setAddress(String address) {
        this.address = address;
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

    // ================= GET SCHOOL ADMIN =================
    public SchoolAdminDto getSchoolAdmin() {
        return schoolAdmin;
    }

    // ================= SET SCHOOL ADMIN =================
    public void setSchoolAdmin(SchoolAdminDto schoolAdmin) {
        this.schoolAdmin = schoolAdmin;
    }

    // ================= GET HODS =================
    public List<HODDto> getHods() {
        return hods;
    }

    // ================= SET HODS =================
    public void setHods(List<HODDto> hods) {
        this.hods = hods;
    }

    // ================= TO STRING =================
    @Override
    public String toString() {

        return "SchoolDto{" +
                "id=" + id +
                ", schoolName='" + schoolName + '\'' +
                ", schoolCode='" + schoolCode + '\'' +
                ", address='" + address + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", schoolAdmin=" + schoolAdmin +
                ", hods=" + hods +
                '}';
    }
}