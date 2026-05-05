package com.example.stud_erp.service;

import com.example.stud_erp.entity.Leave;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.repository.LeaveRepository;
import com.example.stud_erp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ Apply Leave
    public Leave applyLeave(Long studentId, Leave leave) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        leave.setStudent(student);
        leave.setStatus("PENDING");

        return leaveRepository.save(leave);
    }

    // ✅ Student ke leaves
    public List<Leave> getMyLeaves(Long studentId) {
        return leaveRepository.findByStudentId(studentId);
    }

    // ✅ HOD / Teacher ke liye requests
    public List<Leave> getRequests(String role) {
        return leaveRepository.findBySendTo(role);
    }

    // ✅ Approve
    public void approveLeave(Long id) {
        Leave l = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        l.setStatus("APPROVED");
        leaveRepository.save(l);
    }

    // ❌ Reject
    public void rejectLeave(Long id) {
        Leave l = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        l.setStatus("REJECTED");
        leaveRepository.save(l);
    }
}