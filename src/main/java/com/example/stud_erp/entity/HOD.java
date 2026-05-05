package com.example.stud_erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hods", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
public class HOD {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false)
 private String name;

 @Column(length = 255)
 private String imageUrl;

 @Column(nullable = false)
 private String department;

 @Column(unique = true, nullable = false)
 private String username;

 @Column(nullable = false)
 private String password;

 @Column(unique = true, nullable = false)
 private String email;

 @Column(nullable = false)
 private String phone;

 private String coverImage;

 @ElementCollection
 @CollectionTable(name = "hod_subjects", joinColumns = @JoinColumn(name = "hod_id"))
 @Column(name = "subject")
 private List<String> subjects;

 @Column
 private String otp;

 @Column
 private LocalDateTime otpExpiry;

 @Column(nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @Column
 private LocalDateTime updatedAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }

 @PreUpdate
 protected void onUpdate() {
  updatedAt = LocalDateTime.now();
 }

    public void setUpdatedAt(LocalDateTime now) {
    }

 public String getPhone() {
  return phone;
 }

 public void setPhone(String phone) {
  this.phone = phone;
 }

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

 public String getCoverImage() {
  return coverImage;
 }

 public void setCoverImage(String coverImage) {
  this.coverImage = coverImage;
 }
}
