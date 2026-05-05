//package com.example.stud_erp.service;
//
//import com.example.stud_erp.entity.Event;
//import com.example.stud_erp.repository.EventRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Service
//public class EventService {
//
//    @Autowired
//    private EventRepository eventRepository;
//
//    /* ✅ CREATE (PRIVATE BY DEFAULT) */
//    public Event createEvent(Event event) {
//        event.setPublished(false);
//        event.setTarget("ALL");
//        return eventRepository.save(event);
//    }
//
//    /* ✅ ADMIN: ALL EVENTS */
//    public List<Event> getAllEvents() {
//        return eventRepository.findAllByOrderByDateDesc();
//    }
//
//    /* ✅ GET BY ID */
//    public Event getById(Long id) {
//        return eventRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Event not found"));
//    }
//
//    /* ✅ UPDATE EVENT */
//    public Event updateEvent(Long id, Event updated) {
//
//        Event event = getById(id);
//
//        event.setTitle(updated.getTitle());
//        event.setDescription(updated.getDescription());
//        event.setDate(updated.getDate());
//
//        return eventRepository.save(event);
//    }
//
//    /* ✅ DELETE */
//    public String deleteEvent(Long id) {
//        eventRepository.deleteById(id);
//        return "Event Deleted ✅";
//    }
//
//    /* 🔥 PUBLISH EVENT (FIXED TARGET ✅) */
//    public Event publishEvent(Long id, String target) {
//
//        Event event = getById(id);
//
//        // ✅ STANDARD TARGET (IMPORTANT FIX)
//        if (!target.equals("ALL") &&
//                !target.equals("TEACHERS") &&
//                !target.equals("STUDENTS")) {
//            throw new RuntimeException("Invalid target type");
//        }
//
//        event.setPublished(true);
//        event.setTarget(target);
//
//        return eventRepository.save(event);
//    }
//
//    /* 🔥 UNPUBLISH */
//    public Event unpublishEvent(Long id) {
//        Event event = getById(id);
//        event.setPublished(false);
//        return eventRepository.save(event);
//    }
//
//    /* 🔥 STUDENT VIEW (FIXED ✅) */
//    public List<Event> getStudentEvents() {
//        return eventRepository
//                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
//                        List.of("STUDENTS", "ALL")
//                );
//    }
//
//    /* 🔥 TEACHER VIEW (FIXED ✅) */
//    public List<Event> getTeacherEvents() {
//        return eventRepository
//                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
//                        List.of("TEACHERS", "ALL")
//                );
//    }
//
//    /* 🔥 UPCOMING EVENTS (NEW 🔥) */
//    public List<Event> getUpcomingEvents() {
//        return eventRepository
//                .findByIsPublishedTrueAndDateGreaterThanEqualOrderByDateDesc(LocalDate.now());
//    }
//
//    /* 🔥 PAST EVENTS (NEW 🔥) */
//    public List<Event> getPastEvents() {
//        return eventRepository
//                .findByIsPublishedTrueAndDateLessThanOrderByDateDesc(LocalDate.now());
//    }
//
//    /* 🔥 ROLE BASED */
//    public List<Event> getPublicEventsByRole(String role) {
//
//        if (role.equalsIgnoreCase("STUDENT")) {
//            return getStudentEvents();
//        }
//        else if (role.equalsIgnoreCase("TEACHER")) {
//            return getTeacherEvents();
//        }
//        else {
//            return List.of();
//        }
//    }
//}


// after update



//package com.example.stud_erp.service;
//
//import com.example.stud_erp.entity.Event;
//import com.example.stud_erp.entity.Student;
//import com.example.stud_erp.repository.EventRepository;
//import com.example.stud_erp.repository.StudentRepository;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Service
//public class EventService {
//
//    @Autowired
//    private EventRepository eventRepository;
//
//    @Autowired
//    private StudentRepository studentRepository;
//
//    /* ✅ CREATE (PRIVATE BY DEFAULT) */
//    public Event createEvent(Event event) {
//        event.setPublished(false); // 🔥 by default hidden
//        event.setTarget("ALL");
//        return eventRepository.save(event);
//    }
//
//    /* ✅ ADMIN: ALL EVENTS */
//    public List<Event> getAllEvents() {
//        return eventRepository.findAllByOrderByDateDesc();
//    }
//
//    /* ✅ GET BY ID */
//    public Event getById(Long id) {
//        return eventRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Event not found"));
//    }
//
//    /* ✅ UPDATE EVENT */
//    public Event updateEvent(Long id, Event updated) {
//        Event event = getById(id);
//
//        event.setTitle(updated.getTitle());
//        event.setDescription(updated.getDescription());
//        event.setDate(updated.getDate());
//
//        return eventRepository.save(event);
//    }
//
//    /* ✅ DELETE */
//    public String deleteEvent(Long id) {
//        eventRepository.deleteById(id);
//        return "Event Deleted ✅";
//    }
//
//    /* 🔥 PUBLISH EVENT */
//    public Event publishEvent(Long id, String target) {
//
//        Event event = getById(id);
//
//        // 🔥 Safe uppercase handling
//        target = target.toUpperCase();
//
//        if (!target.equals("ALL") &&
//                !target.equals("TEACHER") &&
//                !target.equals("STUDENT")) {
//            throw new RuntimeException("Invalid target type");
//        }
//
//        event.setPublished(true);
//        event.setTarget(target);
//
//        System.out.println("✅ Event Published for: " + target);
//
//        return eventRepository.save(event);
//    }
//
//    /* 🔥 UNPUBLISH */
//    public Event unpublishEvent(Long id) {
//        Event event = getById(id);
//        event.setPublished(false);
//
//        System.out.println("❌ Event Unpublished: ID " + id);
//
//        return eventRepository.save(event);
//    }
//
//    /* 🔥 ✅ STUDENT VIEW */
//    public List<Event> getStudentEvents() {
//
//        List<Event> events = eventRepository
//                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
//                        List.of("ALL", "STUDENT")
//                );
//
//        System.out.println("🎓 Student Events Count: " + events.size());
//
//        return events;
//    }
//
//    /* 🔥 ADVANCED STUDENT VIEW (FUTURE) */
//    public List<Event> getStudentEvents(Long studentId) {
//
//        Student student = studentRepository.findById(studentId)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        return eventRepository
//                .findByIsPublishedTrueAndTargetInAndCreatedAtGreaterThanEqualOrderByDateDesc(
//                        List.of("ALL", "STUDENT"),
//                        student.getCreatedAt()
//                );
//    }
//
//    /* 🔥 ✅ TEACHER VIEW (FIXED VERSION) */
//    public List<Event> getTeacherEvents() {
//
//        List<Event> events = eventRepository
//                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
//                        List.of("ALL", "TEACHER")
//                );
//
//        System.out.println("👨‍🏫 Teacher Events Count: " + events.size());
//
//        return events;
//    }
//
//    /* 🔥 UPCOMING EVENTS */
//    public List<Event> getUpcomingEvents() {
//        return eventRepository
//                .findByIsPublishedTrueAndDateGreaterThanEqualOrderByDateDesc(LocalDate.now());
//    }
//
//    /* 🔥 PAST EVENTS */
//    public List<Event> getPastEvents() {
//        return eventRepository
//                .findByIsPublishedTrueAndDateLessThanOrderByDateDesc(LocalDate.now());
//    }
//
//    /* 🔥 ROLE BASED */
//    public List<Event> getPublicEventsByRole(String role) {
//
//        if (role.equalsIgnoreCase("STUDENT")) {
//            return getStudentEvents();
//        }
//        else if (role.equalsIgnoreCase("TEACHER")) {
//            return getTeacherEvents();
//        }
//        else {
//            return List.of();
//        }
//    }
//}







//
//
//package com.example.stud_erp.service;
//
//import com.example.stud_erp.entity.Event;
//import com.example.stud_erp.entity.Student;
//import com.example.stud_erp.entity.EventResponse;
//import com.example.stud_erp.payload.EventResponseDTO;
//import com.example.stud_erp.repository.EventRepository;
//import com.example.stud_erp.repository.StudentRepository;
//import com.example.stud_erp.repository.EventResponseRepository;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.ArrayList;
//import java.util.Optional;
//
//@Service
//public class EventService {
//
//    @Autowired
//    private EventRepository eventRepository;
//
//    @Autowired
//    private StudentRepository studentRepository;
//
//    @Autowired
//    private EventResponseRepository eventResponseRepository;
//
//    /* ✅ CREATE */
//    public Event createEvent(Event event) {
//        event.setPublished(false);
//        event.setTarget("ALL");
//        return eventRepository.save(event);
//    }
//
//    /* ✅ ADMIN: ALL EVENTS */
//    public List<Event> getAllEvents() {
//        return eventRepository.findAllByOrderByDateDesc();
//    }
//
//    /* ✅ GET BY ID */
//    public Event getById(Long id) {
//        return eventRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Event not found"));
//    }
//
//    /* ✅ UPDATE */
//    public Event updateEvent(Long id, Event updated) {
//        Event event = getById(id);
//
//        event.setTitle(updated.getTitle());
//        event.setDescription(updated.getDescription());
//        event.setDate(updated.getDate());
//
//        return eventRepository.save(event);
//    }
//
//    /* ✅ DELETE */
//    public String deleteEvent(Long id) {
//        eventRepository.deleteById(id);
//        return "Event Deleted ✅";
//    }
//
//    /* 🔥 PUBLISH */
//    public Event publishEvent(Long id, String target) {
//
//        Event event = getById(id);
//
//        target = target.toUpperCase();
//
//        if (!target.equals("ALL") &&
//                !target.equals("TEACHER") &&
//                !target.equals("STUDENT")) {
//            throw new RuntimeException("Invalid target type");
//        }
//
//        event.setPublished(true);
//        event.setTarget(target);
//
//        return eventRepository.save(event);
//    }
//
//    /* 🔥 UNPUBLISH */
//    public Event unpublishEvent(Long id) {
//        Event event = getById(id);
//        event.setPublished(false);
//        return eventRepository.save(event);
//    }
//
//    /* 🔥 STUDENT VIEW */
//    public List<Event> getStudentEvents() {
//
//        return eventRepository
//                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
//                        List.of("ALL", "STUDENT")
//                );
//    }
//
//    /* 🔥 ADVANCED STUDENT */
//    public List<Event> getStudentEvents(Long studentId) {
//
//        Student student = studentRepository.findById(studentId)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        return eventRepository
//                .findByIsPublishedTrueAndTargetInAndCreatedAtGreaterThanEqualOrderByDateDesc(
//                        List.of("ALL", "STUDENT"),
//                        student.getCreatedAt()
//                );
//    }
//
//    /* 🔥 TEACHER VIEW (OLD) */
//    public List<Event> getTeacherEvents() {
//
//        return eventRepository
//                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
//                        List.of("ALL", "TEACHER")
//                );
//    }
//
//    /* 🔥🔥🔥 FINAL FIXED METHOD */
//    public List<EventResponseDTO> getTeacherEventsWithStatus(Long teacherId) {
//
//        List<Event> events = eventRepository
//                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
//                        List.of("ALL", "TEACHER")
//                );
//
//        List<EventResponseDTO> result = new ArrayList<>();
//
//        for (Event event : events) {
//
//            Optional<EventResponse> optionalResponse =
//                    eventResponseRepository.findByEventIdAndTeacherId(event.getId(), teacherId);
//
//            String status = "PENDING";
//
//            if (optionalResponse.isPresent()) {
//                status = optionalResponse.get().getStatus();
//            }
//
//            EventResponseDTO dto = new EventResponseDTO();
//            dto.setEventId(event.getId());
//            dto.setTitle(event.getTitle());
//            dto.setDescription(event.getDescription());
//            dto.setDate(event.getDate().toString());
//            dto.setTarget(event.getTarget());
//            dto.setTeacherId(teacherId);
//            dto.setStatus(status);
//
//            result.add(dto);
//        }
//
//        return result;
//    }
//
//    /* 🔥 UPCOMING */
//    public List<Event> getUpcomingEvents() {
//        return eventRepository
//                .findByIsPublishedTrueAndDateGreaterThanEqualOrderByDateDesc(LocalDate.now());
//    }
//
//
//    /* 🔥 PAST */
//    public List<Event> getPastEvents() {
//        return eventRepository
//                .findByIsPublishedTrueAndDateLessThanOrderByDateDesc(LocalDate.now());
//    }
//
//    /* 🔥 ROLE BASED */
//    public List<Event> getPublicEventsByRole(String role) {
//
//        if (role.equalsIgnoreCase("STUDENT")) {
//            return getStudentEvents();
//        }
//        else if (role.equalsIgnoreCase("TEACHER")) {
//            return getTeacherEvents();
//        }
//        else {
//            return List.of();
//        }
//    }
//}






package com.example.stud_erp.service;

import com.example.stud_erp.entity.Event;
import com.example.stud_erp.payload.EventResponseDTO;
import com.example.stud_erp.repository.EventRepository;
import com.example.stud_erp.repository.EventResponseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventResponseRepository responseRepository;

    /* ================= CRUD ================= */

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByDateDesc();
    }

    public Event getById(Long id) {
        return eventRepository.findById(id).orElseThrow();
    }

    public Event updateEvent(Long id, Event event) {
        Event existing = getById(id);

        existing.setTitle(event.getTitle());
        existing.setDescription(event.getDescription());
        existing.setDate(event.getDate());
        existing.setTarget(event.getTarget());

        return eventRepository.save(existing);
    }

    public String deleteEvent(Long id) {
        eventRepository.deleteById(id);
        return "Deleted Successfully";
    }

    /* ================= PUBLISH ================= */

    public Event publishEvent(Long id, String target) {
        Event event = getById(id);
        event.setPublished(true);
        event.setTarget(target);
        return eventRepository.save(event);
    }

    public Event unpublishEvent(Long id) {
        Event event = getById(id);
        event.setPublished(false);
        return eventRepository.save(event);
    }

    /* ================= ROLE BASED ================= */

    public List<Event> getStudentEvents() {

        return eventRepository
                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
                        Arrays.asList("STUDENTS", "ALL")
                );
    }

    public List<Event> getPublicEventsByRole(String role) {
        return eventRepository
                .findByIsPublishedTrueAndTargetOrderByDateDesc(role);
    }

    /* ================= UPCOMING / PAST ================= */

    public List<Event> getUpcomingEvents() {
        return eventRepository
                .findByIsPublishedTrueAndDateGreaterThanEqualOrderByDateAsc(LocalDate.now());
    }

    public List<Event> getPastEvents() {
        return eventRepository
                .findByIsPublishedTrueAndDateLessThanOrderByDateDesc(LocalDate.now());
    }

    /* ================= TEACHER EVENTS (🔥 FINAL FIX) ================= */

    public List<EventResponseDTO> getTeacherEventsWithStatus(Long teacherId) {

        // 🔥 FIX → TEACHER + ALL दोनों दिखेंगे
        List<Event> events = eventRepository
                .findByIsPublishedTrueAndTargetInOrderByDateDesc(
                        Arrays.asList("TEACHER", "ALL")
                );

        List<EventResponseDTO> list = new ArrayList<>();

        for (Event e : events) {

            EventResponseDTO dto = new EventResponseDTO();

            dto.setEventId(e.getId());
            dto.setTitle(e.getTitle());
            dto.setDescription(e.getDescription());
            dto.setDate(e.getDate() != null ? e.getDate().toString() : "");
            dto.setTarget(e.getTarget());
            dto.setTeacherId(teacherId);

            // 🔥 Find response
            var response = responseRepository
                    .findByEventIdAndTeacherId(e.getId(), teacherId);

            dto.setStatus(response.map(r -> r.getStatus()).orElse("PENDING"));

            list.add(dto);
        }

        return list;
    }
}