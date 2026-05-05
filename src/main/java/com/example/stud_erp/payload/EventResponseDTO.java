//package com.example.stud_erp.payload;
//
//public class EventResponseDTO {
//
//    private Long eventId;
//    private Long teacherId;
//    private String status;
//
//    // 🔥 NEW FIELDS (IMPORTANT)
//    private String title;
//    private String description;
//    private String date;
//    private String target;
//
//    // 🔥 Default Constructor
//    public EventResponseDTO() {}
//
//    // 🔥 All Arguments Constructor
//    public EventResponseDTO(Long eventId, Long teacherId, String status) {
//        this.eventId = eventId;
//        this.teacherId = teacherId;
//        this.status = status;
//    }
//
//    // 🔥 Getters & Setters
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
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    // 🔥 NEW GETTERS & SETTERS
//
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public String getDate() {
//        return date;
//    }
//
//    public void setDate(String date) {
//        this.date = date;
//    }
//
//    public String getTarget() {
//        return target;
//    }
//
//    public void setTarget(String target) {
//        this.target = target;
//    }
//}


package com.example.stud_erp.payload;

public class EventResponseDTO {

    private Long eventId;
    private Long teacherId;
    private String teacherName;   // 🔥 NEW (Admin UI के लिए जरूरी)
    private String status;        // ACCEPTED / REJECTED / MAYBE

    // 🔥 EVENT DETAILS (UI के लिए)
    private String title;
    private String description;
    private String date;
    private String target;

    // 🔥 Default Constructor
    public EventResponseDTO() {}

    // 🔥 All Arguments Constructor
    public EventResponseDTO(Long eventId, Long teacherId, String teacherName, String status) {
        this.eventId = eventId;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.status = status;
    }

    /* ================= GETTERS & SETTERS ================= */

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
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }
}