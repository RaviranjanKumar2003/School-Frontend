package com.example.stud_erp.payload;

public class LoginResponse {

    // ================= BASIC INFO =================
    private Long id;

    private String name;

    private String username;

    private String email;

    private String role;

    // ================= SCHOOL INFO =================
    private Long schoolId;

    private String schoolName;

    private String schoolCode;

    // ================= DEFAULT CONSTRUCTOR =================
    public LoginResponse() {
    }

    // ================= PARAMETERIZED CONSTRUCTOR =================
    public LoginResponse(
            Long id,
            String name,
            String username,
            String email,
            String role,
            Long schoolId,
            String schoolName,
            String schoolCode
    ) {

        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.role = role;

        this.schoolId = schoolId;
        this.schoolName = schoolName;
        this.schoolCode = schoolCode;
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

    // ================= GET EMAIL =================
    public String getEmail() {
        return email;
    }

    // ================= SET EMAIL =================
    public void setEmail(String email) {
        this.email = email;
    }

    // ================= GET ROLE =================
    public String getRole() {
        return role;
    }

    // ================= SET ROLE =================
    public void setRole(String role) {
        this.role = role;
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

        return "LoginResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", schoolId=" + schoolId +
                ", schoolName='" + schoolName + '\'' +
                ", schoolCode='" + schoolCode + '\'' +
                '}';
    }
}