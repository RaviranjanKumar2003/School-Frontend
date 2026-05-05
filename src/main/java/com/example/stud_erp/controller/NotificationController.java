//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Notification;
//import com.example.stud_erp.payload.NotificationDTO;
//import com.example.stud_erp.service.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/notifications")
//public class NotificationController {
//
//    @Autowired
//    private NotificationService notificationService;
//
//    // API for sending notifications (already added)
//    @PostMapping("/send")
//    public ResponseEntity<Notification> sendNotification(@RequestBody NotificationDTO notificationDTO) {
//        Notification notification = notificationService.sendNotification(notificationDTO);
//        return ResponseEntity.ok(notification);
//    }
//
//    // API for students to fetch their notifications
//    @GetMapping("/student/{studentId}")
//    public ResponseEntity<List<Notification>> getNotificationsForStudent(@PathVariable Long studentId) {
//        List<Notification> notifications = notificationService.getNotificationsForStudent(studentId);
//        return ResponseEntity.ok(notifications);
//    }
//
//    // API for professors to fetch their notifications
//    @GetMapping("/professor/{professorId}")
//    public ResponseEntity<List<Notification>> getNotificationsForProfessor(@PathVariable Long professorId) {
//        List<Notification> notifications = notificationService.getNotificationsForProfessor(professorId);
//        return ResponseEntity.ok(notifications);
//    }
//}



//after update



//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Notification;
//import com.example.stud_erp.payload.NotificationDTO;
//import com.example.stud_erp.service.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/notifications")
//@CrossOrigin("*")
//public class NotificationController {
//
//    @Autowired
//    private NotificationService notificationService;
//
//    // ✅ SEND NOTIFICATION
//    @PostMapping("/send")
//    public String sendNotification(@RequestBody NotificationDTO dto) {
//        return notificationService.sendNotification(dto);
//    }
//
//    // ✅ STUDENT NOTIFICATIONS
//    @GetMapping("/student/{id}")
//    public List<Notification> getStudentNotifications(@PathVariable Long id) {
//        return notificationService.getNotificationsForStudent(id);
//    }
//
//    // ✅ PROFESSOR NOTIFICATIONS
//    @GetMapping("/professor/{id}")
//    public List<Notification> getProfessorNotifications(@PathVariable Long id) {
//        return notificationService.getNotificationsForProfessor(id);
//    }
//
//    // ✅ MARK AS READ
//    @PutMapping("/read/{id}")
//    public String markAsRead(@PathVariable Long id) {
//        notificationService.markAsRead(id);
//        return "Notification marked as read";
//    }
//}


// update for deletion

// pintu comment kiya hai
//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Notification;
//import com.example.stud_erp.payload.NotificationDTO;
//import com.example.stud_erp.service.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/notifications")
//@CrossOrigin("*")
//public class NotificationController {
//
//    @Autowired
//    private NotificationService notificationService;
//
//    @PostMapping("/send")
//    public String sendNotification(@RequestBody NotificationDTO dto) {
//        return notificationService.sendNotification(dto);
//    }
//
//    @GetMapping("/student/{id}")
//    public List<Notification> getStudentNotifications(@PathVariable Long id) {
//        return notificationService.getNotificationsForStudent(id);
//    }
//
//    @GetMapping("/professor/{id}")
//    public List<Notification> getProfessorNotifications(@PathVariable Long id) {
//        return notificationService.getNotificationsForProfessor(id);
//    }
//
//    @PutMapping("/read/{id}")
//    public String markAsRead(@PathVariable Long id) {
//        notificationService.markAsRead(id);
//        return "Notification marked as read";
//    }
//
//    // ✅ NEW
//    @PutMapping("/archive/{id}")
//    public String archive(@PathVariable Long id) {
//        notificationService.archiveNotification(id);
//        return "Archived successfully";
//    }
//
//
//    // ✅ NEW
//    @GetMapping("/archived/{studentId}")
//    public List<Notification> getArchived(@PathVariable Long studentId) {
//        return notificationService.getArchivedNotifications(studentId);
//    }
//
//    // ✅ NEW
//    @DeleteMapping("/delete/{id}")
//    public String delete(@PathVariable Long id) {
//        notificationService.deletePermanently(id);
//        return "Deleted permanently";
//    }
//// Unarchive
//
//    @PutMapping("/unarchive/{id}")
//    public String unarchive(@PathVariable Long id) {
//        notificationService.unarchiveNotification(id);
//        return "Restored successfully";
//    }
//}















package com.example.stud_erp.controller;

import com.example.stud_erp.entity.Notification;
import com.example.stud_erp.payload.NotificationDTO;
import com.example.stud_erp.payload.NotificationResponse;
import com.example.stud_erp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public String sendNotification(@RequestBody NotificationDTO dto) {
        return notificationService.sendNotification(dto);
    }

    @GetMapping("/student/{id}")
    public List<NotificationResponse> getStudentNotifications(@PathVariable Long id) {
        return notificationService.getNotificationsForStudent(id);
    }

    @PutMapping("/archive/{notificationId}/{studentId}")
    public String archive(@PathVariable Long notificationId, @PathVariable Long studentId) {
        notificationService.archiveNotification(notificationId, studentId);
        return "Archived";
    }

    @DeleteMapping("/delete/{notificationId}/{studentId}")
    public String delete(@PathVariable Long notificationId, @PathVariable Long studentId) {
        notificationService.deletePermanently(notificationId, studentId);
        return "Deleted";
    }

    @GetMapping("/unread/{studentId}")
    public int unread(@PathVariable Long studentId) {
        return notificationService.getUnreadCount(studentId);
    }

    @PutMapping("/read/{notificationId}/{studentId}")
    public String read(@PathVariable Long notificationId, @PathVariable Long studentId) {
        notificationService.markAsRead(notificationId, studentId);
        return "Read";
    }

    @PutMapping("/unarchive/{notificationId}/{studentId}")
    public String unarchive(@PathVariable Long notificationId, @PathVariable Long studentId) {
        notificationService.unarchiveNotification(notificationId, studentId);
        return "Restored";
    }

    @GetMapping("/archived/{studentId}")
    public List<NotificationResponse> getArchived(@PathVariable Long studentId) {
        return notificationService.getArchivedNotifications(studentId);
    }
}