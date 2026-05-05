package com.example.stud_erp.payload;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long notificationUserId;
    private Long notificationId;
    private String title;
    private String message;
    private String sender;
    private boolean readStatus;
    private LocalDateTime sentAt;


    public Long getNotificationUserId() {
        return notificationUserId;
    }

    public void setNotificationUserId(Long notificationUserId) {
        this.notificationUserId = notificationUserId;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public boolean isReadStatus() {
        return readStatus;
    }

    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}