//package com.example.stud_erp.service;
//
//import com.example.stud_erp.entity.Notification;
//import com.example.stud_erp.entity.Professor;
//import com.example.stud_erp.entity.Student;
//import com.example.stud_erp.payload.NotificationDTO;
//import com.example.stud_erp.repository.NotificationRepository;
//import com.example.stud_erp.repository.ProfessorRepository;
//import com.example.stud_erp.repository.StudentRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class NotificationService {
//
//    @Autowired
//    private NotificationRepository notificationRepository;
//
//    @Autowired
//    private StudentRepository studentRepository;
//
//    @Autowired
//    private ProfessorRepository professorRepository;
//
//    // ✅ SEND NOTIFICATION (UNCHANGED)
//    public String sendNotification(NotificationDTO dto) {
//
//        String type = dto.getRecipientType();
//
//        switch (type) {
//
//            case "STUDENT":
//            case "INDIVIDUAL":
//
//                if (dto.getRecipientId() == null) {
//                    throw new RuntimeException("Recipient ID required");
//                }
//
//                Student student = studentRepository.findById(dto.getRecipientId()).orElse(null);
//
//                if (student != null) {
//                    Notification n = new Notification(dto);
//                    n.setStudent(student);
//                    notificationRepository.save(n);
//                    return "Sent to Student";
//                }
//
//                Professor professor = professorRepository.findById(dto.getRecipientId()).orElse(null);
//
//                if (professor != null) {
//                    Notification n = new Notification(dto);
//                    n.setProfessor(professor);
//                    notificationRepository.save(n);
//                    return "Sent to Professor";
//                }
//
//                throw new RuntimeException("User not found");
//
//            case "ALL_STUDENTS":
//
//                List<Student> students = studentRepository.findAll();
//
//                for (Student s : students) {
//                    Notification n = new Notification(dto);
//                    n.setStudent(s);
//                    notificationRepository.save(n);
//                }
//
//                return "Sent to all students";
//
//            case "ALL_TEACHERS":
//
//                List<Professor> professors = professorRepository.findAll();
//
//                for (Professor p : professors) {
//                    Notification n = new Notification(dto);
//                    n.setProfessor(p);
//                    notificationRepository.save(n);
//                }
//
//                return "Sent to all teachers";
//
//            case "ALL":
//
//                studentRepository.findAll().forEach(s -> {
//                    Notification n = new Notification(dto);
//                    n.setStudent(s);
//                    notificationRepository.save(n);
//                });
//
//                professorRepository.findAll().forEach(p -> {
//                    Notification n = new Notification(dto);
//                    n.setProfessor(p);
//                    notificationRepository.save(n);
//                });
//
//                return "Sent to all users";
//
//            default:
//                throw new RuntimeException("Invalid Recipient Type");
//        }
//    }
//
//    // ✅ FIXED (only active notifications)
//    public List<Notification> getNotificationsForStudent(Long studentId) {
//        return notificationRepository.findActiveByStudentId(studentId);
//    }
//
//    public List<Notification> getNotificationsForProfessor(Long professorId) {
//        return notificationRepository.findByProfessorId(professorId);
//    }
//
//    // ✅ MARK AS READ
//    public void markAsRead(Long id) {
//        Notification n = notificationRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        n.setReadStatus(true);
//        notificationRepository.save(n);
//    }
//
//    // ✅ ARCHIVE (SOFT DELETE)
//    public void archiveNotification(Long id) {
//        Notification n = notificationRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        if (!n.getReadStatus()) {
//            throw new RuntimeException("पहले read करो");
//        }
//
//        n.setIsArchived(true);
//        notificationRepository.save(n);
//    }
//
//    // ✅ GET ARCHIVED
//    public List<Notification> getArchivedNotifications(Long studentId) {
//        return notificationRepository.findArchivedByStudentId(studentId);
//    }
//
//    // ✅ PERMANENT DELETE
//    public void deletePermanently(Long id){
//        notificationRepository.deleteById(id);
//    }
//
//   //  Unarchive
//    public void unarchiveNotification(Long id) {
//        Notification n = notificationRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        n.setIsArchived(false);
//        notificationRepository.save(n);
//    }
//}
//












package com.example.stud_erp.service;

import com.example.stud_erp.entity.*;
import com.example.stud_erp.payload.NotificationDTO;
import com.example.stud_erp.payload.NotificationResponse;
import com.example.stud_erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private NotificationUserRepository notificationUserRepository;

    public String sendNotification(NotificationDTO dto) {

        String type = dto.getRecipientType();

        switch (type) {

            case "INDIVIDUAL": {

                Student student = studentRepository.findById(dto.getRecipientId()).orElse(null);

                if (student != null) {
                    Notification n = new Notification(dto);
                    notificationRepository.save(n);

                    NotificationUser nu = new NotificationUser();
                    nu.setNotificationId(n.getId());
                    nu.setUserId(student.getId());
                    nu.setUserType("STUDENT");

                    notificationUserRepository.save(nu);
                    return "Sent to Student";
                }

                Professor professor = professorRepository.findById(dto.getRecipientId()).orElse(null);

                if (professor != null) {
                    Notification n = new Notification(dto);
                    notificationRepository.save(n);

                    NotificationUser nu = new NotificationUser();
                    nu.setNotificationId(n.getId());
                    nu.setUserId(professor.getId());
                    nu.setUserType("TEACHER");

                    notificationUserRepository.save(nu);
                    return "Sent to Teacher";
                }

                throw new RuntimeException("User not found");
            }

            case "ALL_STUDENTS": {

                Notification n = new Notification(dto);
                notificationRepository.save(n);

                List<Student> students = studentRepository.findAll();

                for (Student s : students) {
                    NotificationUser nu = new NotificationUser();
                    nu.setNotificationId(n.getId());
                    nu.setUserId(s.getId());
                    nu.setUserType("STUDENT");
                    notificationUserRepository.save(nu);
                }

                return "Sent to all students";
            }

            case "ALL_TEACHERS": {

                Notification n = new Notification(dto);
                notificationRepository.save(n);

                List<Professor> professors = professorRepository.findAll();

                for (Professor p : professors) {
                    NotificationUser nu = new NotificationUser();
                    nu.setNotificationId(n.getId());
                    nu.setUserId(p.getId());
                    nu.setUserType("TEACHER");
                    notificationUserRepository.save(nu);
                }

                return "Sent to all teachers";
            }

            case "ALL": {

                Notification n = new Notification(dto);
                notificationRepository.save(n);

                studentRepository.findAll().forEach(s -> {
                    NotificationUser nu = new NotificationUser();
                    nu.setNotificationId(n.getId());
                    nu.setUserId(s.getId());
                    nu.setUserType("STUDENT");
                    notificationUserRepository.save(nu);
                });

                professorRepository.findAll().forEach(p -> {
                    NotificationUser nu = new NotificationUser();
                    nu.setNotificationId(n.getId());
                    nu.setUserId(p.getId());
                    nu.setUserType("TEACHER");
                    notificationUserRepository.save(nu);
                });

                return "Sent to all users";
            }

            default:
                throw new RuntimeException("Invalid Recipient Type");
        }
    }

    public List<NotificationResponse> getArchivedNotifications(Long studentId) {

        List<NotificationUser> list =
                notificationUserRepository.findByUserIdAndUserTypeAndIsArchivedTrue(studentId, "STUDENT");

        return list.stream().map(nu -> {

            Notification n = notificationRepository
                    .findById(nu.getNotificationId())
                    .orElse(null);

            NotificationResponse res = new NotificationResponse();
            res.setNotificationUserId(nu.getId());
            res.setNotificationId(n.getId());
            res.setTitle(n.getTitle());
            res.setMessage(n.getMessage());
            res.setSender(n.getSender());
            res.setReadStatus(nu.isReadStatus());
            res.setSentAt(n.getSentAt());

            return res;

        }).toList();
    }

    public void archiveNotification(Long notificationId, Long studentId) {

        NotificationUser nu = notificationUserRepository
                .findByNotificationIdAndUserIdAndUserType(notificationId, studentId, "STUDENT");

        if (nu == null) {
            throw new RuntimeException("Not found");
        }

        nu.setArchived(true);
        notificationUserRepository.save(nu);
    }

    public void deletePermanently(Long notificationId, Long studentId){

        NotificationUser nu = notificationUserRepository
                .findByNotificationIdAndUserIdAndUserType(notificationId, studentId, "STUDENT");

        if (nu != null) {
            notificationUserRepository.delete(nu);
        }
    }

    public int getUnreadCount(Long studentId) {
        return notificationUserRepository
                .findByUserIdAndUserTypeAndReadStatusFalseAndIsArchivedFalse(studentId, "STUDENT")
                .size();
    }

    public void markAsRead(Long notificationId, Long studentId) {

        NotificationUser nu = notificationUserRepository
                .findByNotificationIdAndUserIdAndUserType(notificationId, studentId, "STUDENT");

        if (nu == null) {
            return;
        }

        nu.setReadStatus(true);
        notificationUserRepository.save(nu);
    }

    public void unarchiveNotification(Long notificationId, Long studentId) {

        NotificationUser nu = notificationUserRepository
                .findByNotificationIdAndUserIdAndUserType(notificationId, studentId, "STUDENT");

        if (nu == null) {
            throw new RuntimeException("Not found");
        }

        nu.setArchived(false);
        notificationUserRepository.save(nu);
    }

    public List<NotificationResponse> getNotificationsForStudent(Long studentId) {

        List<NotificationUser> list =
                notificationUserRepository.findByUserIdAndUserTypeAndIsArchivedFalse(studentId, "STUDENT");

        return list.stream().map(nu -> {

            Notification n = notificationRepository
                    .findById(nu.getNotificationId())
                    .orElse(null);

            NotificationResponse res = new NotificationResponse();
            res.setNotificationUserId(nu.getId());
            res.setNotificationId(n.getId());
            res.setTitle(n.getTitle());
            res.setMessage(n.getMessage());
            res.setSender(n.getSender());
            res.setReadStatus(nu.isReadStatus());
            res.setSentAt(n.getSentAt());

            return res;

        }).toList();
    }
}
