package com.example.stud_erp.repository;

import com.example.stud_erp.entity.NotificationUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationUserRepository extends JpaRepository<NotificationUser, Long> {

    List<NotificationUser> findByUserIdAndUserTypeAndIsArchivedFalse(Long userId, String userType);

    List<NotificationUser> findByUserIdAndUserTypeAndReadStatusFalseAndIsArchivedFalse(Long userId, String userType);

    // 🔥 NEW (important)
    NotificationUser findByNotificationIdAndUserIdAndUserType(Long notificationId, Long userId, String userType);

    List<NotificationUser> findByUserIdAndUserTypeAndIsArchivedTrue(Long userId, String userType);
    
}