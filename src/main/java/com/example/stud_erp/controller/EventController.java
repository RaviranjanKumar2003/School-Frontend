//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Event;
//import com.example.stud_erp.service.EventService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/events")
//@CrossOrigin("*")
//public class EventController {
//
//    @Autowired
//    private EventService eventService;
//
//    // ✅ CREATE (PRIVATE BY DEFAULT)
//    @PostMapping
//    public Event create(@RequestBody Event event) {
//        return eventService.createEvent(event);
//    }
//
//    // ✅ ADMIN: ALL EVENTS
//    @GetMapping
//    public List<Event> getAll() {
//        return eventService.getAllEvents();
//    }
//
//    // ✅ GET ONE
//    @GetMapping("/{id}")
//    public Event getOne(@PathVariable Long id) {
//        return eventService.getById(id);
//    }
//
//    // ✅ UPDATE
//    @PutMapping("/{id}")
//    public Event update(@PathVariable Long id, @RequestBody Event event) {
//        return eventService.updateEvent(id, event);
//    }
//
//    // ✅ DELETE
//    @DeleteMapping("/{id}")
//    public String delete(@PathVariable Long id) {
//        return eventService.deleteEvent(id);
//    }
//
//    // 🔥 PUBLISH EVENT
//    @PutMapping("/publish/{id}")
//    public Event publishEvent(
//            @PathVariable Long id,
//            @RequestParam String target // ALL / TEACHER / STUDENT
//    ) {
//        return eventService.publishEvent(id, target);
//    }
//
//    // 🔥 UNPUBLISH EVENT (NEW 🔥)
//    @PutMapping("/unpublish/{id}")
//    public Event unpublishEvent(@PathVariable Long id) {
//        return eventService.unpublishEvent(id);
//    }
//
//    // 🔥 STUDENT EVENTS
//    @GetMapping("/student")
//    public List<Event> getStudentEvents() {
//        return eventService.getStudentEvents();
//    }
//
//    // 🔥 TEACHER EVENTS
//    @GetMapping("/teacher")
//    public List<Event> getTeacherEvents() {
//        return eventService.getTeacherEvents();
//    }
//
//    // 🔥 ROLE BASED
//    @GetMapping("/public")
//    public List<Event> getByRole(@RequestParam String role) {
//        return eventService.getPublicEventsByRole(role);
//    }
//}


// after update


//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Event;
//import com.example.stud_erp.service.EventService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/events")
//@CrossOrigin("*")
//public class EventController {
//
//    @Autowired
//    private EventService eventService;
//
//    // ✅ CREATE
//    @PostMapping
//    public Event create(@RequestBody Event event) {
//        return eventService.createEvent(event);
//    }
//
//    // ✅ ALL EVENTS (ADMIN / HOD)
//    @GetMapping
//    public List<Event> getAll() {
//        return eventService.getAllEvents();
//    }
//
//    // ✅ SINGLE EVENT
//    @GetMapping("/{id}")
//    public Event getOne(@PathVariable Long id) {
//        return eventService.getById(id);
//    }
//
//    // ✅ UPDATE
//    @PutMapping("/{id}")
//    public Event update(@PathVariable Long id, @RequestBody Event event) {
//        return eventService.updateEvent(id, event);
//    }
//
//    // ✅ DELETE
//    @DeleteMapping("/{id}")
//    public String delete(@PathVariable Long id) {
//        return eventService.deleteEvent(id);
//    }
//
//    // 🔥 PUBLISH
//    @PutMapping("/publish/{id}")
//    public Event publishEvent(@PathVariable Long id,
//                              @RequestParam String target) {
//        return eventService.publishEvent(id, target);
//    }
//
//    // 🔥 UNPUBLISH
//    @PutMapping("/unpublish/{id}")
//    public Event unpublishEvent(@PathVariable Long id) {
//        return eventService.unpublishEvent(id);
//    }
//
//    // 🔥 ✅ FIXED STUDENT API (NO ID)
//    @GetMapping("/student")
//    public List<Event> getStudentEvents() {
//        return eventService.getStudentEvents();
//    }
//
//    // 🔥 TEACHER
//    @GetMapping("/teacher")
//    public List<Event> getTeacherEvents() {
//        return eventService.getTeacherEvents();
//    }
//
//    // 🔥 ROLE BASED (OPTIONAL)
//    @GetMapping("/public")
//    public List<Event> getByRole(@RequestParam String role) {
//        return eventService.getPublicEventsByRole(role);
//    }
//}





//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Event;
//import com.example.stud_erp.entity.EventResponse;
//import com.example.stud_erp.service.EventService;
//import com.example.stud_erp.payload.EventResponseDTO;
//import com.example.stud_erp.service.EventResponseService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/events")
//@CrossOrigin("*")
//public class EventController {
//
//    @Autowired
//    private EventService eventService;
//
//    @Autowired
//    private EventResponseService eventResponseService;
//
//    // ✅ CREATE
//    @PostMapping
//    public Event create(@RequestBody Event event) {
//        return eventService.createEvent(event);
//    }
//
//    // ✅ ALL EVENTS
//    @GetMapping
//    public List<Event> getAll() {
//        return eventService.getAllEvents();
//    }
//
//    // ✅ SINGLE EVENT
//    @GetMapping("/{id}")
//    public Event getOne(@PathVariable Long id) {
//        return eventService.getById(id);
//    }
//
//    // ✅ UPDATE
//    @PutMapping("/{id}")
//    public Event update(@PathVariable Long id, @RequestBody Event event) {
//        return eventService.updateEvent(id, event);
//    }
//
//    // ✅ DELETE
//    @DeleteMapping("/{id}")
//    public String delete(@PathVariable Long id) {
//        return eventService.deleteEvent(id);
//    }
//
//    // 🔥 PUBLISH
//    @PutMapping("/publish/{id}")
//    public Event publishEvent(@PathVariable Long id,
//                              @RequestParam String target) {
//        return eventService.publishEvent(id, target);
//    }
//
//    // 🔥 UNPUBLISH
//    @PutMapping("/unpublish/{id}")
//    public Event unpublishEvent(@PathVariable Long id) {
//        return eventService.unpublishEvent(id);
//    }
//
//    // 🔥 STUDENT EVENTS
//    @GetMapping("/student")
//    public List<Event> getStudentEvents() {
//        return eventService.getStudentEvents();
//    }
//
//    // 🔥 TEACHER EVENTS
//    @GetMapping("/teacher")
//    public List<Event> getTeacherEvents() {
//        return eventService.getTeacherEvents();
//    }
//
//    // 🔥 ROLE BASED
//    @GetMapping("/public")
//    public List<Event> getByRole(@RequestParam String role) {
//        return eventService.getPublicEventsByRole(role);
//    }
//
//    // 🔥 SAVE RESPONSE
//    @PostMapping("/respond")
//    public String respondToEvent(@RequestBody EventResponseDTO dto) {
//
//        eventResponseService.saveResponse(dto);
//
//        return "Response Saved Successfully";
//    }
//
//    // 🔥🔥🔥 NEW: GET ALL RESPONSES (ADMIN PANEL)
//    @GetMapping("/responses")
//    public List<EventResponse> getAllResponses() {
//        return eventResponseService.getAllResponses();
//    }
//}


//
//
//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Event;
//import com.example.stud_erp.entity.EventResponse;
//import com.example.stud_erp.payload.EventResponseDTO;
//
//import com.example.stud_erp.service.EventResponseService;
//import com.example.stud_erp.service.EventService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/events")
//@CrossOrigin("*")
//public class EventController {
//
//    @Autowired
//    private EventService eventService;
//
//    @Autowired
//    private EventResponseService eventResponseService;
//
//    // ✅ CREATE EVENT
//    @PostMapping
//    public Event create(@RequestBody Event event) {
//        return eventService.createEvent(event);
//    }
//
//    // ✅ GET ALL EVENTS
//    @GetMapping
//    public List<Event> getAll() {
//        return eventService.getAllEvents();
//    }
//
//    // ✅ GET SINGLE EVENT
//    @GetMapping("/{id}")
//    public Event getOne(@PathVariable Long id) {
//        return eventService.getById(id);
//    }
//
//    // ✅ UPDATE EVENT
//    @PutMapping("/{id}")
//    public Event update(@PathVariable Long id, @RequestBody Event event) {
//        return eventService.updateEvent(id, event);
//    }
//
//    // ✅ DELETE EVENT
//    @DeleteMapping("/{id}")
//    public String delete(@PathVariable Long id) {
//        return eventService.deleteEvent(id);
//    }
//
//    // 🔥 PUBLISH EVENT
//    @PutMapping("/publish/{id}")
//    public Event publishEvent(@PathVariable Long id,
//                              @RequestParam String target) {
//        return eventService.publishEvent(id, target);
//    }
//
//    // 🔥 UNPUBLISH EVENT
//    @PutMapping("/unpublish/{id}")
//    public Event unpublishEvent(@PathVariable Long id) {
//        return eventService.unpublishEvent(id);
//    }
//
//    // 🔥 STUDENT EVENTS
//    @GetMapping("/student")
//    public List<Event> getStudentEvents() {
//        return eventService.getStudentEvents();
//    }
//
//    // 🔥🔥🔥 UPDATED: TEACHER EVENTS WITH STATUS
//    @GetMapping("/teacher")
//    public List<EventResponseDTO> getTeacherEvents(@RequestParam Long teacherId) {
//        return eventService.getTeacherEventsWithStatus(teacherId);
//    }
//
//    // 🔥 ROLE BASED EVENTS
//    @GetMapping("/public")
//    public List<Event> getByRole(@RequestParam String role) {
//        return eventService.getPublicEventsByRole(role);
//    }
//
//    // 🔥 SAVE / UPDATE RESPONSE
//    @PostMapping("/respond")
//    public String respondToEvent(@RequestBody EventResponseDTO dto) {
//
//        eventResponseService.saveResponse(dto);
//
//        return "Response Saved Successfully";
//    }
//
//    // 🔥 GET ALL RESPONSES (ADMIN USE)
//    @GetMapping("/responses")
//    public List<EventResponse> getAllResponses() {
//        return eventResponseService.getAllResponses();
//    }
//
//}




//
//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Event;
//import com.example.stud_erp.entity.EventResponse;
//import com.example.stud_erp.payload.EventResponseDTO;
//import com.example.stud_erp.service.EventResponseService;
//import com.example.stud_erp.service.EventService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/events")
//@CrossOrigin("*")
//public class EventController {
//
//    @Autowired
//    private EventService eventService;
//
//    @Autowired
//    private EventResponseService eventResponseService;
//
//    // ✅ CREATE EVENT
//    @PostMapping
//    public ResponseEntity<Event> create(@RequestBody Event event) {
//        return ResponseEntity.ok(eventService.createEvent(event));
//    }
//
//    // ✅ GET ALL EVENTS
//    @GetMapping
//    public ResponseEntity<List<Event>> getAll() {
//        return ResponseEntity.ok(eventService.getAllEvents());
//    }
//
//    // ✅ GET SINGLE EVENT
//    @GetMapping("/{id}")
//    public ResponseEntity<Event> getOne(@PathVariable Long id) {
//        return ResponseEntity.ok(eventService.getById(id));
//    }
//
//    // ✅ UPDATE EVENT
//    @PutMapping("/{id}")
//    public ResponseEntity<Event> update(@PathVariable Long id, @RequestBody Event event) {
//        return ResponseEntity.ok(eventService.updateEvent(id, event));
//    }
//
//    // ✅ DELETE EVENT
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> delete(@PathVariable Long id) {
//        return ResponseEntity.ok(eventService.deleteEvent(id));
//    }
//
//    // 🔥 PUBLISH EVENT
//    @PutMapping("/publish/{id}")
//    public ResponseEntity<Event> publishEvent(@PathVariable Long id,
//                                              @RequestParam String target) {
//        return ResponseEntity.ok(eventService.publishEvent(id, target));
//    }
//
//    // 🔥 UNPUBLISH EVENT
//    @PutMapping("/unpublish/{id}")
//    public ResponseEntity<Event> unpublishEvent(@PathVariable Long id) {
//        return ResponseEntity.ok(eventService.unpublishEvent(id));
//    }
//
//    // 🔥 STUDENT EVENTS
//    @GetMapping("/student")
//    public ResponseEntity<List<Event>> getStudentEvents() {
//        return ResponseEntity.ok(eventService.getStudentEvents());
//    }
//
//    // 🔥 TEACHER EVENTS WITH STATUS
//    @GetMapping("/teacher")
//    public ResponseEntity<List<EventResponseDTO>> getTeacherEvents(
//            @RequestParam Long teacherId) {
//
//        return ResponseEntity.ok(
//                eventService.getTeacherEventsWithStatus(teacherId)
//        );
//    }
//
//    // 🔥 UPCOMING EVENTS (NEW 🔥🔥🔥)
//    @GetMapping("/upcoming")
//    public ResponseEntity<List<Event>> getUpcomingEvents() {
//        return ResponseEntity.ok(
//                eventService.getUpcomingEvents()
//        );
//    }
//
//    // 🔥 ROLE BASED EVENTS
//    @GetMapping("/public")
//    public ResponseEntity<List<Event>> getByRole(@RequestParam String role) {
//        return ResponseEntity.ok(
//                eventService.getPublicEventsByRole(role)
//        );
//    }
//
//    // 🔥 SAVE / UPDATE RESPONSE
//    @PostMapping("/respond")
//    public ResponseEntity<String> respondToEvent(@RequestBody EventResponseDTO dto) {
//
//        eventResponseService.saveResponse(dto);
//
//        return ResponseEntity.ok("Response Saved Successfully");
//    }
//
//    // 🔥 GET ALL RESPONSES (ADMIN)
//    @GetMapping("/responses")
//    public ResponseEntity<List<EventResponse>> getAllResponses() {
//        return ResponseEntity.ok(
//                eventResponseService.getAllResponses()
//        );
//    }
//}




package com.example.stud_erp.controller;

import com.example.stud_erp.entity.Event;
import com.example.stud_erp.entity.EventComment;
import com.example.stud_erp.entity.EventReaction;
import com.example.stud_erp.entity.EventResponse;
import com.example.stud_erp.payload.EventResponseDTO;
import com.example.stud_erp.service.EventCommentService;
import com.example.stud_erp.service.EventReactionService;
import com.example.stud_erp.service.EventResponseService;
import com.example.stud_erp.service.EventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin("*")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventResponseService eventResponseService;

    @Autowired
    private EventReactionService reactionService;

    @Autowired
    private EventCommentService commentService;

    /* ================= EVENT CRUD ================= */

    @PostMapping
    public ResponseEntity<Event> create(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAll() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> update(@PathVariable Long id, @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.deleteEvent(id));
    }

    /* ================= PUBLISH ================= */

    @PutMapping("/publish/{id}")
    public ResponseEntity<Event> publishEvent(@PathVariable Long id,
                                              @RequestParam String target) {
        return ResponseEntity.ok(eventService.publishEvent(id, target));
    }

    @PutMapping("/unpublish/{id}")
    public ResponseEntity<Event> unpublishEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.unpublishEvent(id));
    }

    /* ================= USER EVENTS ================= */

    @GetMapping("/student")
    public ResponseEntity<List<Event>> getStudentEvents() {
        return ResponseEntity.ok(eventService.getStudentEvents());
    }

    @GetMapping("/teacher")
    public ResponseEntity<List<EventResponseDTO>> getTeacherEvents(
            @RequestParam Long teacherId) {

        return ResponseEntity.ok(
                eventService.getTeacherEventsWithStatus(teacherId)
        );
    }

    /* ================= UPCOMING / PAST ================= */

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/past")
    public ResponseEntity<List<Event>> getPastEvents() {
        return ResponseEntity.ok(eventService.getPastEvents());
    }

    /* ================= ROLE BASED ================= */

    @GetMapping("/public")
    public ResponseEntity<List<Event>> getByRole(@RequestParam String role) {
        return ResponseEntity.ok(
                eventService.getPublicEventsByRole(role)
        );
    }

    /* ================= RESPONSE ================= */

    @PostMapping("/respond")
    public ResponseEntity<String> respondToEvent(@RequestBody EventResponseDTO dto) {

        eventResponseService.saveResponse(dto);

        return ResponseEntity.ok("Response Saved / Updated ✅");
    }

    /* ================= ADMIN PANEL ================= */

    @GetMapping("/responses")
    public ResponseEntity<List<EventResponse>> getAllResponses() {
        return ResponseEntity.ok(eventResponseService.getAllResponses());
    }

    // 🔥 EVENT WISE RESPONSES (FIXED → DTO ONLY)
    @GetMapping("/responses/{eventId}")
    public ResponseEntity<List<EventResponseDTO>> getResponsesByEvent(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                eventResponseService.getResponsesByEvent(eventId)
        );
    }

    // 🔥 ANALYTICS
    @GetMapping("/responses/stats/{eventId}")
    public ResponseEntity<Map<String, Long>> getStats(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                eventResponseService.getResponseStats(eventId)
        );
    }

//  Student Like Comment Karege
    @PostMapping("/react")
      public ResponseEntity<String> react(@RequestBody EventReaction dto) {

      reactionService.saveReaction(dto);

      return ResponseEntity.ok("Saved");
    }

    @GetMapping("/reactions/{eventId}")
    public ResponseEntity<List<EventReaction>> getReactions(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                reactionService.getByEvent(eventId)
        );
    }
    @PostMapping("/comment")
    public ResponseEntity<?> comment(@RequestBody EventComment dto) {
        commentService.saveComment(dto);
        return ResponseEntity.ok("Comment saved");
    }

    @GetMapping("/comments/{eventId}")
    public ResponseEntity<?> getComments(@PathVariable Long eventId) {
        return ResponseEntity.ok(commentService.getByEvent(eventId));
    }

    @DeleteMapping("/comment/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestParam Long studentId) {

        commentService.deleteComment(id, studentId);
        return ResponseEntity.ok("Deleted");
    }

    @PutMapping("/comment/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam Long studentId,
            @RequestBody Map<String, String> body) {

        commentService.updateComment(id, studentId, body.get("comment"));
        return ResponseEntity.ok("Updated");
    }
}