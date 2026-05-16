package com.example.stud_erp.payload;

public class LoginRequest {

    private String username;
    private String password;

    // ================= DEFAULT CONSTRUCTOR =================
    public LoginRequest() {
    }

    // ================= PARAMETERIZED CONSTRUCTOR =================
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
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

    // ================= TO STRING =================
    @Override
    public String toString() {
        return "LoginRequest{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}