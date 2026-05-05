//package com.example.stud_erp.entity;
//
//import jakarta.persistence.*;
//
//@Entity
//@Table(
//        name = "event_response",
//        uniqueConstraints = {
//                @UniqueConstraint(columnNames = {"eventId", "teacherId"}) // 🔥 duplicate रोकने के लिए
//        }
//)
//public class EventResponse {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private Long eventId;
//
//    private Long teacherId;
//
//    // 🔥 NEW FIELD (ADMIN UI के लिए)
//    private String teacherName;
//
//    private String status;
//
//    // 🔥 OPTIONAL (future use)
//    private String responseTime;
//
//    // ================= GETTERS & SETTERS =================
//
//    public Long getId() {
//        return id;
//    }
//
//    public Long getEventId() {
//        return eventId;
//    }
//
//    public void setEventId(Long eventId) {
//        this.eventId = eventId;
//    }
//
//    public Long getTeacherId() {
//        return teacherId;
//    }
//
//    public void setTeacherId(Long teacherId) {
//        this.teacherId = teacherId;
//    }
//
//    public String getTeacherName() {
//        return teacherName;
//    }
//
//    public void setTeacherName(String teacherName) {
//        this.teacherName = teacherName;
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
//    public String getResponseTime() {
//        return responseTime;
//    }
//
//    public void setResponseTime(String responseTime) {
//        this.responseTime = responseTime;
//    }
//}




package com.example.stud_erp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "event_response",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"eventId", "teacherId"})
        }
)
public class EventResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* 🔥 RELATION IDS */
    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private Long teacherId;

    /* 🔥 ADMIN UI */
    private String teacherName;

    /* 🔥 STATUS (ACCEPTED / REJECTED / MAYBE) */
    @Column(nullable = false)
    private String status = "PENDING";

    /* 🔥 TRACKING TIME */
    private LocalDateTime respondedAt;

    private LocalDateTime updatedAt;

    /* 🔥 Constructor */
    public EventResponse() {}

    /* 🔥 AUTO TIME SET */
    @PrePersist
    protected void onCreate() {
        this.respondedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /* ================= GETTERS & SETTERS ================= */

    public Long getId() {
        return id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status.toUpperCase();
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}