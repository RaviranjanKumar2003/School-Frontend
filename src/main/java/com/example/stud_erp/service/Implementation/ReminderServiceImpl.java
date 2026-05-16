package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.FeeItem;
import com.example.stud_erp.entity.ReminderLog;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.StudentFee;
import com.example.stud_erp.repository.ReminderLogRepository;
import com.example.stud_erp.repository.StudentFeeRepository;
import com.example.stud_erp.repository.StudentRepository;
import com.example.stud_erp.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class ReminderServiceImpl implements ReminderService {

    @Autowired
    private StudentFeeRepository studentFeeRepo;

    @Autowired
    private ReminderLogRepository reminderRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Override
    public void sendReminder(String studentId) {

        String month = LocalDate.now().getMonth().toString();
        int year = LocalDate.now().getYear();

        StudentFee fee = studentFeeRepo
                .findByStudentIdAndMonthAndYear(studentId, month, year)
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        // 🔥 MESSAGE BUILD
        StringBuilder message = new StringBuilder();

        message.append("Dear Parent,\n\n");
        message.append("Student: ").append(fee.getStudentName()).append("\n\n");

        message.append("Fee Details:\n");

        for (FeeItem item : fee.getFeeItems()) {
            message.append("- ")
                    .append(item.getTitle())
                    .append(" (")
                    .append(item.getDescription())
                    .append("): ₹")
                    .append(item.getAmount())
                    .append("\n");
        }

        message.append("\nTotal: ₹").append(fee.getTotalFee());
        message.append("\nPaid: ₹").append(fee.getPaidAmount());
        message.append("\nPending: ₹").append(fee.getPendingAmount());

        // 👉 Yaha SMS/WhatsApp API call lagana hai
        System.out.println(message.toString());

        // 🔥 SAVE LOG
        ReminderLog log = new ReminderLog();
        log.setStudentId(fee.getStudentId());
        log.setStudentName(fee.getStudentName());
        Student student = studentRepo.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String mobile = student.getStudPhoneNumber();
        log.setAmount(fee.getPendingAmount());
        log.setStatus("SENT");
        log.setSentAt(LocalDateTime.now());
        log.setMessage(message.toString());

        reminderRepo.save(log);
    }
}
