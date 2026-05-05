package com.example.stud_erp.controller;

import com.example.stud_erp.entity.RecheckRequest;
import com.example.stud_erp.entity.Result;
import com.example.stud_erp.payload.NotificationDTO;
import com.example.stud_erp.service.NotificationService;
import com.example.stud_erp.service.RecheckService;
import com.example.stud_erp.service.ResultService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recheck")
@CrossOrigin("*")
public class RecheckController {

    @Autowired
    private RecheckService recheckService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private NotificationService notificationService;

    // ✅ 1. STUDENT REQUEST RECHECK
    @PostMapping("/request")
    public RecheckRequest requestRecheck(@RequestBody RecheckRequest request) {

        RecheckRequest saved = recheckService.createRequest(request);

        // 🔔 Notify Admin/Teachers
        NotificationDTO dto = new NotificationDTO();
        dto.setTitle("Recheck Request");
        dto.setMessage("Student requested recheck for subjects: "
                + String.join(", ", request.getSubjects()));
        dto.setRecipientType("ALL_TEACHERS");
        dto.setSender("STUDENT");

        notificationService.sendNotification(dto);

        return saved;
    }

    // ✅ 2. ADMIN APPROVE RECHECK
    @PutMapping("/approve/{id}")
    public RecheckRequest approveRecheck(@PathVariable Long id) {

        RecheckRequest updated = recheckService.approveRequest(id);

        // 🔔 Notify Teacher
        NotificationDTO dto = new NotificationDTO();
        dto.setTitle("Recheck Approved");
        dto.setMessage("Recheck approved for studentId: "
                + updated.getStudentId()
                + ", Subjects: " + String.join(", ", updated.getSubjects()));
        dto.setRecipientType("ALL_TEACHERS");
        dto.setSender("ADMIN");

        notificationService.sendNotification(dto);

        return updated;
    }

    // ❌ 3. ADMIN REJECT
    @PutMapping("/reject/{id}")
    public RecheckRequest rejectRecheck(@PathVariable Long id) {

        RecheckRequest updated = recheckService.rejectRequest(id);

        // 🔔 Notify Student
        NotificationDTO dto = new NotificationDTO();
        dto.setTitle("Recheck Rejected");
        dto.setMessage("Your recheck request has been rejected");
        dto.setRecipientType("INDIVIDUAL");
        dto.setRecipientId(updated.getStudentId());
        dto.setSender("ADMIN");

        notificationService.sendNotification(dto);

        return updated;
    }

    // ✅ 4. TEACHER VIEW APPROVED LIST
    @GetMapping("/teacher/{teacherId}")
    public List<RecheckRequest> getTeacherRequests(@PathVariable Long teacherId) {
        return recheckService.getAllRequests()
                .stream()
                .filter(r -> "APPROVED".equals(r.getStatus())
                        && r.getProfessorId().equals(teacherId))
                .toList();
    }

    @GetMapping("/admin")
    public List<RecheckRequest> getAllForAdmin() {
        return recheckService.getAllRequests();
    }


    @PutMapping("/update/{id}")
    public String updateAfterRecheck(
            @PathVariable Long id,
            @RequestParam String subject,
            @RequestParam int newMarks
    ) {

        RecheckRequest req = recheckService.getById(id);

        resultService.updateMarks(req.getStudentId(), subject, newMarks);

        req.setStatus("COMPLETED");
        recheckService.save(req);

        return "Recheck Completed ✅";
    }

//    Recheck  copy

    @GetMapping("/student/{studentId}")
    public List<RecheckRequest> getStudentRequests(@PathVariable Long studentId) {
        return recheckService.getStudentRequests(studentId);
    }

    // ✅ 6. ADMIN VIEW ALL
    @GetMapping("/all")
    public List<RecheckRequest> getAllRequests() {
        return recheckService.getAllRequests();
    }


    @PutMapping("/no-change/{id}")
    public String noChange(
            @PathVariable Long id,
            @RequestParam String remark
    ) {

        RecheckRequest req = recheckService.getById(id);
        req.setStatus("COMPLETED"); // ✅ status change
        req.setTeacherRemark(remark); // ✅ reason save

        recheckService.save(req);

        return "No Change Saved ✅";
    }
}