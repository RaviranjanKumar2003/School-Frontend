//package com.example.stud_erp.repository;
//
//import com.example.stud_erp.entity.Event;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//
//public interface EventRepository extends JpaRepository<Event, Long> {
//
//    /* 🔥 ================= ADMIN ================= */
//
//    // All events (latest first)
//    List<Event> findAllByOrderByDateDesc();
//
//
//    /* 🔥 ================= PUBLIC EVENTS ================= */
//
//    // All published events
//    List<Event> findByIsPublishedTrueOrderByDateDesc();
//
//
//    /* 🔥 ================= TARGET BASED ================= */
//
//    // Student / Teacher / All filter
//    List<Event> findByIsPublishedTrueAndTargetInOrderByDateDesc(List<String> targets);
//
//
//    /* 🔥 ================= 🔥 NEW (IMPORTANT) ================= */
//
//    // ✅ STUDENT FILTER (Admission ke baad wale events)
//    List<Event> findByIsPublishedTrueAndTargetInAndCreatedAtGreaterThanEqualOrderByDateDesc(
//            List<String> targets,
//            LocalDateTime createdAt
//    );
//
//
//    /* 🔥 ================= OPTIONAL (PRO LEVEL) ================= */
//
//    // Only TEACHER events
//    List<Event> findByIsPublishedTrueAndTargetOrderByDateDesc(String target);
//
//
//    /* 🔥 ================= DATE FILTER ================= */
//
//    // Upcoming events
//    List<Event> findByIsPublishedTrueAndDateGreaterThanEqualOrderByDateDesc(LocalDate date);
//
//    // Past events
//    List<Event> findByIsPublishedTrueAndDateLessThanOrderByDateDesc(LocalDate date);
//}

package com.example.stud_erp.repository;

import com.example.stud_erp.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    /* ================= ADMIN ================= */

    List<Event> findAllByOrderByDateDesc();


    /* ================= PUBLIC ================= */

    List<Event> findByIsPublishedTrueOrderByDateDesc();


    /* ================= TARGET ================= */

    // 🔥 MULTIPLE TARGET (STUDENT / TEACHER / ALL)
    List<Event> findByIsPublishedTrueAndTargetInOrderByDateDesc(List<String> targets);

    // 🔥 SINGLE TARGET (IMPORTANT FIX ✅)
    List<Event> findByIsPublishedTrueAndTargetOrderByDateDesc(String target);


    /* ================= DATE ================= */

    // 🔥 UPCOMING
    List<Event> findByIsPublishedTrueAndDateGreaterThanEqualOrderByDateAsc(LocalDate date);

    // 🔥 PAST
    List<Event> findByIsPublishedTrueAndDateLessThanOrderByDateDesc(LocalDate date);


    /* ================= EXTRA ================= */

    // 🔥 Admission based filter
    List<Event> findByIsPublishedTrueAndTargetInAndCreatedAtGreaterThanEqualOrderByDateDesc(
            List<String> targets,
            LocalDateTime createdAt
    );
}