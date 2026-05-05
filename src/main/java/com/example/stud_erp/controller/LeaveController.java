package com.example.stud_erp.controller;

import com.example.stud_erp.entity.Leave;
import com.example.stud_erp.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
@CrossOrigin("*")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    // ✅ Apply leave
    @PostMapping
    public Leave applyLeave(@RequestBody Leave leave,
                            @RequestParam Long studentId) {
        return leaveService.applyLeave(studentId, leave);
    }

    // ✅ My leaves
    @GetMapping("/my")
    public List<Leave> myLeaves(@RequestParam Long studentId) {
        return leaveService.getMyLeaves(studentId);
    }

    // ✅ HOD / Teacher dashboard
    @GetMapping("/requests/{role}")
    public List<Leave> getRequests(@PathVariable String role) {
        return leaveService.getRequests(role);
    }

    // ✅ Approve
    @PutMapping("/approve/{id}")
    public String approve(@PathVariable Long id) {
        leaveService.approveLeave(id);
        return "Approved";
    }

    // ❌ Reject
    @PutMapping("/reject/{id}")
    public String reject(@PathVariable Long id) {
        leaveService.rejectLeave(id);
        return "Rejected";
    }
}