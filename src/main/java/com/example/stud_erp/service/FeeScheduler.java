package com.example.stud_erp.service;

import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.StudentFee;
import com.example.stud_erp.repository.StudentFeeRepository;
import com.example.stud_erp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FeeScheduler {

    @Autowired
    private StudentFeeRepository feeRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private EmailService emailService;

    // 🔥 AUTO REMINDER (DAILY RUN)
    @Scheduled(cron = "0 0 10 * * ?") // roz 10 baje
    public void autoReminder() {

        int day = LocalDate.now().getDayOfMonth();

        // 5 tareekh ke pehle kuch nahi karega
        if (day < 5) return;

        // sab pending fees nikaal
        List<StudentFee> list = feeRepo.findByStatus("PENDING");

        for (StudentFee fee : list) {

            Student s = studentRepo
                    .findByStudentId(fee.getStudentId())
                    .orElse(null);

            // agar student nahi mila to skip
            if (s == null) continue;

            // ✅ FIXED METHOD NAME (yahi tera main error tha)
            emailService.sendFeeReminder(
                    s.getEmail(),
                    s.getStudName(),
                    fee.getPendingAmount()
            );
        }

        System.out.println("🔥 Fee Reminder Sent Successfully");
    }
}