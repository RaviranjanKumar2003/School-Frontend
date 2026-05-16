package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.FeeItem;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.StudentFee;
import com.example.stud_erp.payload.FeeItemDTO;
import com.example.stud_erp.payload.StudentFeeDTO;
import com.example.stud_erp.payload.SummaryDTO;
import com.example.stud_erp.repository.StudentFeeRepository;
import com.example.stud_erp.repository.StudentRepository;
import com.example.stud_erp.service.StudentFeeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentFeeServiceImpl implements StudentFeeService {

    @Autowired
    private StudentFeeRepository repo;

    @Autowired
    private StudentRepository studentRepo;

    @Override
    public StudentFeeDTO addOrUpdateFee(StudentFeeDTO dto) {

        String month = LocalDate.now().getMonth().toString();
        int year = LocalDate.now().getYear();

        // 🔥 FIND CURRENT MONTH FEE
        StudentFee fee = repo
                .findByStudentIdAndMonthAndYear(dto.getStudentId(), month, year)
                .orElse(null);

// 🔥 NEW MONTH AUTO RESET
        if (fee == null) {
            fee = new StudentFee();
            fee.setStudentId(dto.getStudentId());
            fee.setStudentName(dto.getStudentName());
            fee.setClassNumber(dto.getClassNumber());

            // 🔥 RESET VALUES
            fee.setTotalFee(0.0);
            fee.setPaidAmount(0.0);
            fee.setPendingAmount(0.0);
            fee.setStatus("NOT_ASSIGNED");
        }

        List<FeeItem> newItems = new ArrayList<>();

        double total = 0.0; // 🔥 IMPORTANT

        if (dto.getFeeItems() != null) {
            for (FeeItemDTO i : dto.getFeeItems()) {

                FeeItem item = new FeeItem();
                item.setTitle(i.getTitle());
                item.setDescription(i.getDescription());
                item.setAmount(i.getAmount());
                item.setStudentFee(fee);

                newItems.add(item);

                // 🔥 TOTAL CALCULATE
                total += i.getAmount() != null ? i.getAmount() : 0.0;
            }
        }

        fee.setFeeItems(newItems);

        // 🔥 MANUAL TOTAL SET
        fee.setTotalFee(total);

        if (fee.getPaidAmount() == null) {
            fee.setPaidAmount(0.0);
        }

        fee.setPendingAmount(total - fee.getPaidAmount());

        // 🔥 STATUS FIX
        if (total == 0) {
            fee.setStatus("NOT_ASSIGNED");
        } else if (fee.getPendingAmount() == 0) {
            fee.setStatus("PAID");
        } else {
            fee.setStatus("PENDING");
        }

        fee.setMonth(month);
        fee.setYear(year);
        fee.setPaymentDate(LocalDate.now());

        StudentFee saved = repo.save(fee);

        return mapToDTO(saved);
    }

    @Override
    public List<StudentFeeDTO> getAllFees() {
        return repo.findAll().stream().map(this::mapToDTO).toList();
    }


    @Override
    public List<StudentFeeDTO> getByStudent(String id) {

        // 🔥 STEP 1: numeric id → student निकालो
        Student student = studentRepo.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 🔥 STEP 2: उसका real studentId लो
        String realStudentId = student.getStudentId();

        // 🔥 STEP 3: fees fetch करो
        return repo.findByStudentId(realStudentId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public StudentFeeDTO updatePayment(StudentFeeDTO dto) {

        StudentFee fee = repo.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        fee.setPaidAmount(dto.getPaidAmount());
        fee.setPaymentMode(dto.getPaymentMode());
        fee.setRemark(dto.getRemark());

        // 🔥 payment date update
        fee.setPaymentDate(LocalDate.now());

        StudentFee updated = repo.save(fee);

        return mapToDTO(updated);
    }

    // 🔁 MAPPER
    private StudentFeeDTO mapToDTO(StudentFee fee) {

        StudentFeeDTO dto = new StudentFeeDTO();

        dto.setId(fee.getId());
        dto.setStudentId(fee.getStudentId());
        dto.setStudentName(fee.getStudentName());

        dto.setTotalFee(fee.getTotalFee());
        dto.setPaidAmount(fee.getPaidAmount());
        dto.setPendingAmount(fee.getPendingAmount());
        dto.setStatus(fee.getStatus());

        dto.setPaymentDate(fee.getPaymentDate());

        dto.setFeeItems(
                fee.getFeeItems().stream().map(i -> {
                    FeeItemDTO item = new FeeItemDTO();
                    item.setTitle(i.getTitle());
                    item.setDescription(i.getDescription());
                    item.setAmount(i.getAmount());
                    return item;
                }).toList()
        );

        return dto;
    }


    @Override
    public SummaryDTO getSummary(Integer classId) {

        String month = LocalDate.now().getMonth().toString();
        int year = LocalDate.now().getYear();

        List<StudentFee> fees;

        if (classId == null) {
            // 🔥 ONLY CURRENT MONTH
            fees = repo.findByMonthAndYear(month, year);
        } else {
            // 🔥 CLASS + MONTH FILTER
            fees = repo.findByClassNumberAndMonthAndYear(classId, month, year);
        }

        SummaryDTO dto = new SummaryDTO();

        dto.setTotalStudents((long) fees.size());

        dto.setPaidStudents(
                fees.stream().filter(f -> "PAID".equals(f.getStatus())).count()
        );

        dto.setPendingStudents(
                fees.stream().filter(f -> "PENDING".equals(f.getStatus())).count()
        );

        dto.setTotalCollectionAmount(
                fees.stream().mapToDouble(f -> f.getPaidAmount() != null ? f.getPaidAmount() : 0).sum()
        );

        dto.setTotalPendingAmount(
                fees.stream().mapToDouble(f -> f.getPendingAmount() != null ? f.getPendingAmount() : 0).sum()
        );

        dto.setTotalFeeAmount(
                fees.stream().mapToDouble(f -> f.getTotalFee() != null ? f.getTotalFee() : 0).sum()
        );

        return dto;
    }
}