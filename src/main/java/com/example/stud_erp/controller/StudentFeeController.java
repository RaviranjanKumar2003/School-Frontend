//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.StudentFee;
//import com.example.stud_erp.repository.StudentFeeRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/fees")
//@CrossOrigin("*")
//public class StudentFeeController {
//
//    @Autowired
//    private StudentFeeRepository repo;
//
//    // ✅ Add Fee
//    @PostMapping("/add")
//    public StudentFee addFee(@RequestBody StudentFee fee) {
//        return repo.save(fee);
//    }
//
//    // ✅ Get All Fees
//    @GetMapping("/all")
//    public List<StudentFee> getAllFees() {
//        return repo.findAll();
//    }
//
//    // ✅ Get Paid Students
//    @GetMapping("/paid")
//    public List<StudentFee> getPaidFees() {
//        return repo.findByStatus("PAID");
//    }
//
//    // ✅ Get Pending Students
//    @GetMapping("/pending")
//    public List<StudentFee> getPendingFees() {
//        return repo.findByStatus("PENDING");
//    }
//
//    // ✅ Search by Name
//    @GetMapping("/search/{name}")
//    public List<StudentFee> searchByName(@PathVariable String name) {
//        return repo.findByStudentNameContainingIgnoreCase(name);
//    }
//
//    // ✅ Filter by Class
//    @GetMapping("/class/{className}")
//    public List<StudentFee> getByClass(@PathVariable String className) {
//        return repo.findByClassName(className);
//    }
//
//    // ✅ Delete
//    @DeleteMapping("/delete/{id}")
//    public String deleteFee(@PathVariable Long id) {
//        repo.deleteById(id);
//        return "Deleted Successfully";
//    }
//}



//package com.example.stud_erp.controller;
//
//import com.example.stud_erp.entity.Student;
//import com.example.stud_erp.entity.StudentFee;
//import com.example.stud_erp.repository.StudentFeeRepository;
//import com.example.stud_erp.repository.StudentRepository;
//import com.example.stud_erp.service.EmailService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/fees")
//@CrossOrigin("*")
//public class StudentFeeController {
//
//    @Autowired
//    private StudentFeeRepository repo;
//
//    @Autowired
//    private StudentRepository studentRepo;
//
//    @Autowired
//    private EmailService emailService;
//
//    // ✅ ADD FEE WITH DUES
//    @PostMapping("/add")
//    public StudentFee addFee(@RequestBody StudentFee fee) {
//
//        List<StudentFee> old = repo.findByStudentIdOrderByIdDesc(fee.getStudentId());
//
//        if (!old.isEmpty()) {
//            StudentFee last = old.get(0);
//
//            if (last.getPendingAmount() != null && last.getPendingAmount() > 0) {
//                fee.setTotalFee(fee.getTotalFee() + last.getPendingAmount());
//            }
//        }
//
//        fee.setPaymentDate(LocalDate.now());
//
//        return repo.save(fee);
//    }
//
//    // ✅ GET ALL (🔥 AUTO CREATE FIX)
//    @GetMapping("/all")
//    public List<StudentFee> all() {
//
//        List<StudentFee> fees = repo.findAll();
//
//        if (fees.isEmpty()) {
//
//            List<Student> students = studentRepo.findAll();
//
//            for (Student s : students) {
//
//                StudentFee f = new StudentFee();
//
//                f.setStudentId(s.getId());
//                f.setStudentName(s.getStudName());
//
//                f.setMonth("March");
//                f.setYear(2026);
//
//                f.setTotalFee(1000.0);
//                f.setPaidAmount(0.0);
//                f.setPaymentDate(LocalDate.now());
//
//                repo.save(f);
//            }
//
//            return repo.findAll();
//        }
//
//        return fees;
//    }
//
//    // ✅ GET PAID
//    @GetMapping("/paid")
//    public List<StudentFee> paid() {
//        return repo.findByStatus("PAID");
//    }
//
//    // ✅ GET PENDING
//    @GetMapping("/pending")
//    public List<StudentFee> pending() {
//        return repo.findByStatus("PENDING");
//    }
//
//    // ✅ SEARCH
//    @GetMapping("/search/{name}")
//    public List<StudentFee> search(@PathVariable String name) {
//        return repo.findByStudentNameContainingIgnoreCase(name);
//    }
//
//    // ✅ SUMMARY (🔥 FIXED KEYS)
//    @GetMapping("/summary")
//    public Object getSummary() {
//
//        List<StudentFee> all = repo.findAll();
//
//        int total = all.size();
//
//        long paid = all.stream()
//                .filter(f -> "PAID".equals(f.getStatus()))
//                .count();
//
//        long pending = all.stream()
//                .filter(f -> "PENDING".equals(f.getStatus()))
//                .count();
//
//        double totalCollection = all.stream()
//                .mapToDouble(f -> f.getPaidAmount() == null ? 0 : f.getPaidAmount())
//                .sum();
//
//        double totalPending = all.stream()
//                .mapToDouble(f -> f.getPendingAmount() == null ? 0 : f.getPendingAmount())
//                .sum();
//
//        return new Object() {
//            public int totalStudents = total;
//            public long paidStudents = paid;
//            public long pendingStudents = pending;
//            public double totalCollectionAmount = totalCollection;
//            public double totalPendingAmount = totalPending;
//        };
//    }
//
//    // ✅ REMINDER FIX
//    @PostMapping("/reminder/{studentId}")
//    public String sendReminder(@PathVariable Long studentId) {
//
//        Student s = studentRepo.findById(studentId).orElse(null);
//
//        if (s == null) return "Student Not Found";
//
//        List<StudentFee> fees = repo.findByStudentIdOrderByIdDesc(studentId);
//
//        if (fees.isEmpty()) return "No Fee Record";
//
//        StudentFee f = fees.get(0);
//
//        if ("PAID".equals(f.getStatus())) return "Already Paid";
//
//        emailService.sendFeeReminder(
//                s.getEmail(),
//                s.getStudName(),
//                f.getPendingAmount() == null ? 0 : f.getPendingAmount()
//        );
//
//        return "Reminder Sent Successfully";
//    }
//}




package com.example.stud_erp.controller;

import com.example.stud_erp.entity.ReminderLog;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.StudentFee;
import com.example.stud_erp.payload.StudentFeeDTO;
import com.example.stud_erp.repository.ReminderLogRepository;
import com.example.stud_erp.repository.StudentFeeRepository;
import com.example.stud_erp.repository.StudentRepository;
import com.example.stud_erp.service.ReminderService;
import com.example.stud_erp.service.SmsService;
import com.example.stud_erp.service.StudentFeeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.stud_erp.payload.SummaryDTO;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin("*")
public class StudentFeeController {

    @Autowired
    private StudentFeeService service;

    @Autowired
    private StudentFeeRepository repo;

    @Autowired
    private SmsService smsService;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private ReminderLogRepository logRepo;

    private ReminderService reminderService;

    // 🔥 ADD / UPDATE
    @PostMapping("/add")
    public StudentFeeDTO add(@RequestBody StudentFeeDTO dto) {
        return service.addOrUpdateFee(dto);
    }

    // 🔥 GET ALL
    @GetMapping("/all")
    public List<StudentFeeDTO> all() {
        return service.getAllFees();
    }

    // 🔥 HISTORY
    @GetMapping("/history/{studentId}")
    public List<StudentFeeDTO> history(@PathVariable String studentId) {
        return service.getByStudent(studentId);
    }

    // 🔥 PAYMENT UPDATE
    @PutMapping("/pay")
    public StudentFeeDTO pay(@RequestBody StudentFeeDTO dto) {
        return service.updatePayment(dto);
    }

    // 🔥 SUMMARY (ALL / CLASS BASED)
    @GetMapping("/summary")
    public SummaryDTO getSummary(
            @RequestParam(required = false) Integer classId
    ) {
        return service.getSummary(classId);
    }

    @PostMapping("/send-reminder/{studentId}")
    public String sendReminder(@PathVariable String studentId) {
        reminderService.sendReminder(studentId);
        return "Reminder Sent Successfully";
    }

    @GetMapping("/reminder-history/{studentId}")
    public List<ReminderLog> getLogsByStudent(@PathVariable String studentId) {
        return logRepo.findByStudentId(studentId);
    }

    @GetMapping("/latest-reminder/{studentId}")
    public ReminderLog getLatest(@PathVariable String studentId) {
        return logRepo.findTopByStudentIdOrderBySentAtDesc(studentId);
    }

    @GetMapping("/reminder-history")
    public List<ReminderLog> getLogs() {
        return logRepo.findAll();
    }

}