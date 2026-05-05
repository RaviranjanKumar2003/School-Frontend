//package com.example.stud_erp.repository;
//
//import com.example.stud_erp.entity.Notification;
//import com.example.stud_erp.entity.RecipientType;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//public interface NotificationRepository extends JpaRepository<Notification, Long> {
//
//    // Find notifications for a specific student
//    @Query("SELECT n FROM Notification n WHERE n.student.id = :studentId ORDER BY n.sentAt DESC")
//    List<Notification> findByStudentId(Long studentId);
//
//    // Find notifications for a specific professor
//    @Query("SELECT n FROM Notification n WHERE n.professor.id = :professorId ORDER BY n.sentAt DESC")
//    List<Notification> findByProfessorId(Long professorId);
//}
//



//package com.example.stud_erp.repository;
//
//import com.example.stud_erp.entity.Notification;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//
//import java.util.List;
//
//public interface NotificationRepository extends JpaRepository<Notification, Long> {
//
//    // ✅ Student ke liye notifications
//    @Query("SELECT n FROM Notification n WHERE n.student.id = :studentId ORDER BY n.sentAt DESC")
//    List<Notification> findByStudentId(Long studentId);
//
//    // ✅ Professor ke liye notifications
//    @Query("SELECT n FROM Notification n WHERE n.professor.id = :professorId ORDER BY n.sentAt DESC")
//    List<Notification> findByProfessorId(Long professorId);
//}


// update for deletion



package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // ✅ Active Notifications (NOT archived)
//    @Query("SELECT n FROM Notification n WHERE n.student.id = :studentId AND n.isArchived = false ORDER BY n.sentAt DESC")
//    List<Notification> findActiveByStudentId(Long studentId);

    @Query(value = """
    SELECT * FROM notifications n
    WHERE 
    (n.student_id = :studentId OR n.recipient_type LIKE 'ALL%')
    AND n.is_archived = false
    ORDER BY n.sent_at DESC
    """, nativeQuery = true)
    List<Notification> findActiveByStudentId(Long studentId);
    // ✅ Archived Notifications
    @Query("SELECT n FROM Notification n WHERE n.student.id = :studentId AND n.isArchived = true ORDER BY n.sentAt DESC")
    List<Notification> findArchivedByStudentId(Long studentId);

    // Existing (unchanged)
    @Query("SELECT n FROM Notification n WHERE n.professor.id = :professorId ORDER BY n.sentAt DESC")
    List<Notification> findByProfessorId(Long professorId);
}