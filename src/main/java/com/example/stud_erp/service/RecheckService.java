package com.example.stud_erp.service;

import com.example.stud_erp.entity.ExamSchedule;
import com.example.stud_erp.entity.RecheckRequest;
import com.example.stud_erp.entity.Result;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.repository.ExamScheduleRepository;
import com.example.stud_erp.repository.RecheckRepository;
import com.example.stud_erp.repository.ResultRepository;
import com.example.stud_erp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecheckService {

    @Autowired
    private RecheckRepository recheckRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ExamScheduleRepository examScheduleRepository;

    public RecheckRequest createRequest(RecheckRequest request){

        String subject = request.getSubjects().get(0);

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ExamSchedule exam = examScheduleRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        request.setStudentName(
                student.getStudName() + " " + student.getStudLastName()
        );

        request.setStudentImage(student.getImageUrl());
        request.setProfessorId(exam.getTeacherId());
        request.setClassId(exam.getClassId());
        request.setSubjectName(subject);

        request.setTotalMarks(exam.getTotalMarks());
        request.setExamType(exam.getExamType().name());

        // 🔥 THIS WAS MISSING
        Result result = resultRepository
                .findByStudentIdAndSubjectAndExamId(
                        request.getStudentId(),
                        subject,
                        request.getExamId()
                )
                .orElse(null);

        if (result != null) {
            request.setOldMarks(result.getMarks());
        } else {
            request.setOldMarks(0);
        }

        request.setStatus("PENDING");

        return recheckRepository.save(request);
    }

    // ✅ 2. GET ALL PENDING REQUESTS
    public List<RecheckRequest> getPendingRequests() {
        return recheckRepository.findByStatus("PENDING");
    }

    // ✅ 3. APPROVE REQUEST
    public RecheckRequest approveRequest(Long id) {

        RecheckRequest req = getById(id);

        req.setStatus("APPROVED");

        return recheckRepository.save(req);
    }

    // ❌ 4. REJECT REQUEST
    public RecheckRequest rejectRequest(Long id) {

        RecheckRequest req = getById(id);

        req.setStatus("REJECTED");

        return recheckRepository.save(req);
    }

    // ✅ 5. STUDENT HISTORY
    public List<RecheckRequest> getStudentRequests(Long studentId) {
        return recheckRepository.findByStudentId(studentId);
    }

    // ✅ 6. GET ALL REQUESTS
    public List<RecheckRequest> getAllRequests() {
        return recheckRepository.findAll();
    }

    // ✅ 7. GET BY ID
    public RecheckRequest getById(Long id) {
        return recheckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    // 🔥 8. SAVE (for controller use)
    public RecheckRequest save(RecheckRequest req) {
        return recheckRepository.save(req);
    }
}