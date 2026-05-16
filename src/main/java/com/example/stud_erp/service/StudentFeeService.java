package com.example.stud_erp.service;

import com.example.stud_erp.payload.StudentFeeDTO;
import com.example.stud_erp.payload.SummaryDTO;

import java.util.List;

public interface StudentFeeService {

    StudentFeeDTO addOrUpdateFee(StudentFeeDTO dto);

    List<StudentFeeDTO> getAllFees();

    List<StudentFeeDTO> getByStudent(String studentId);

    StudentFeeDTO updatePayment(StudentFeeDTO dto);

    SummaryDTO getSummary(Integer classId);
}