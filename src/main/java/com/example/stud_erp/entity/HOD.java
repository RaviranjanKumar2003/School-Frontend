package com.example.stud_erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(
        name = "hods",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        }
)
public class HOD {

 // ================= ID =================
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 // ================= BASIC INFO =================
 @Column(nullable = false)
 private String name;

 private String imageUrl;

 @Column(nullable = false)
 private String department;

 @Column(nullable = false, unique = true)
 private String username;

 @Column(nullable = false)
 private String password;

 @Column(nullable = false, unique = true)
 private String email;

 @Column(nullable = false)
 private String phone;

 // ================= SUBJECTS =================
 @ElementCollection
 @CollectionTable(
         name = "hod_subjects",
         joinColumns = @JoinColumn(name = "hod_id")
 )
 @Column(name = "subject")
 private List<String> subjects;

 // ================= OTP =================
 private String otp;

 private LocalDateTime otpExpiry;

 // ================= AUDIT =================
 private LocalDateTime createdAt;

 private LocalDateTime updatedAt;

 // ================= SCHOOL =================
 @ManyToOne(fetch = FetchType.LAZY)

 @JoinColumn(
         name = "school_id",
         nullable = false
 )

 @JsonIgnoreProperties({
         "schoolAdmin",
         "hods",
         "hibernateLazyInitializer",
         "handler"
 })

 private School school;

 // ================= LIFECYCLE =================
 @PrePersist
 public void onCreate() {

  createdAt = LocalDateTime.now();

  updatedAt = LocalDateTime.now();
 }

 @PreUpdate
 public void onUpdate() {

  updatedAt = LocalDateTime.now();
 }

 // ================= GETTERS & SETTERS =================

 public Long getId() {
  return id;
 }

 public void setId(Long id) {
  this.id = id;
 }

 public String getName() {
  return name;
 }

 public void setName(String name) {
  this.name = name;
 }

 public String getImageUrl() {
  return imageUrl;
 }

 public void setImageUrl(String imageUrl) {
  this.imageUrl = imageUrl;
 }

 public String getDepartment() {
  return department;
 }

 public void setDepartment(String department) {
  this.department = department;
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

 public String getPhone() {
  return phone;
 }

 public void setPhone(String phone) {
  this.phone = phone;
 }

 public List<String> getSubjects() {
  return subjects;
 }

 public void setSubjects(List<String> subjects) {
  this.subjects = subjects;
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

 public School getSchool() {
  return school;
 }

 public void setSchool(School school) {
  this.school = school;
 }
}