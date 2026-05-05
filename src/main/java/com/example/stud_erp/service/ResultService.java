package com.example.stud_erp.service;

import com.example.stud_erp.entity.ExamSchedule;
import com.example.stud_erp.entity.Result;
import com.example.stud_erp.entity.StudentExam;
import com.example.stud_erp.enums.ExamType;
import com.example.stud_erp.payload.ResultDTO;
import com.example.stud_erp.repository.ExamScheduleRepository;
import com.example.stud_erp.repository.ResultRepository;
import com.example.stud_erp.repository.StudentExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private StudentExamRepository studentExamRepo;

    @Autowired
    private ExamScheduleRepository examRepo;

    // ❌ REMOVE duplicate repo
    // @Autowired
    // private ResultRepository resultRepo;


    // ✅ SAVE MARKS (Teacher)
    public Result saveMarks(Result r) {

        // 🔥 FIXED (repo ➝ resultRepository)
        if (resultRepository
                .findByStudentIdAndSubjectAndExamId(
                        r.getStudentId(),
                        r.getSubject(),
                        r.getExamId()
                )
                .isPresent()) {

            throw new RuntimeException("❌ Marks already submitted for this exam");
        }

        StudentExam se = studentExamRepo
                .findByStudentIdAndExamScheduleId(
                        r.getStudentId(),
                        r.getExamId()
                );

        if (se == null) {
            throw new RuntimeException("❌ No exam record found");
        }

        // 🔥 exam fetch
        ExamSchedule exam = examRepo
                .findById(se.getExamScheduleId())
                .orElseThrow(() -> new RuntimeException("❌ Exam not found"));

        r.setExamId(se.getExamScheduleId());
        r.setClassId(exam.getClassId());

        int totalMarks = exam.getTotalMarks();
        r.setTotalMarks(totalMarks);

        // 🔥 ABSENT
        if ("ABSENT".equals(se.getExamStatus())) {
            r.setMarks(0);
            r.setStatus("ABSENT");
            r.setPercentage(0.0);
            r.setGrade("D");
        }

        // 🔥 PRESENT
        else if ("PRESENT".equals(se.getExamStatus())) {

            // ✅ VALIDATION
            if (r.getMarks() > totalMarks) {
                throw new RuntimeException(
                        "❌ Marks cannot exceed total marks (" + totalMarks + ")"
                );
            }

            double percentage = (r.getMarks() * 100.0) / totalMarks;
            r.setPercentage(percentage);

            if (r.getMarks() < 33) {
                r.setStatus("FAIL");
            } else {
                r.setStatus("PASS");
            }

            if (percentage >= 90) r.setGrade("A+");
            else if (percentage >= 75) r.setGrade("A");
            else if (percentage >= 60) r.setGrade("B");
            else if (percentage >= 50) r.setGrade("C");
            else r.setGrade("D");
        }

        r.setPublishStatus("DRAFT");

        return resultRepository.save(r);
    }

    // ✅ FULL RESULT (Student View)
    public List<ResultDTO> getStudentFullResult(Long studentId) {

        List<Result> results =
                resultRepository.findByStudentIdAndPublishStatus(
                        studentId,
                        "PUBLISHED"
                );

        if (results.isEmpty()) {
            throw new RuntimeException("RESULT_WAITING");
        }

        List<ResultDTO> list = new ArrayList<>();

        for (Result r : results) {
            ExamSchedule exam = examRepo.findById(r.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));

            list.add(new ResultDTO(
                    r.getExamId(),
                    r.getClassId(),
                    r.getProfessorId(),
                    r.getSubject(),
                    r.getMarks(),
                    exam.getTotalMarks(),
                    r.getStatus(),
                    r.getGrade(),
                    exam.getExamType().name()
            ));
        }

        return list;
    }

    // ✅ UPDATE MARKS (Recheck)
    public Result updateMarks(Long studentId, String subject, int newMarks) {

        Result result = resultRepository
                .findByStudentIdAndSubject(studentId, subject)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        result.setMarks(newMarks);

        // 🔥 exam से totalMarks लो
        ExamSchedule exam = examRepo.findById(result.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        int totalMarks = exam.getTotalMarks();
        if (newMarks > totalMarks) {
            throw new RuntimeException("Marks cannot exceed total marks (" + totalMarks + ")");
        }
        double percentage = (newMarks * 100.0) / totalMarks;
        result.setPercentage(percentage);

        if (newMarks == 0) result.setStatus("ABSENT");
        else if (newMarks < 33) result.setStatus("FAIL");
        else result.setStatus("PASS");

        if (percentage >= 90) result.setGrade("A+");
        else if (percentage >= 75) result.setGrade("A");
        else if (percentage >= 60) result.setGrade("B");
        else if (percentage >= 50) result.setGrade("C");
        else result.setGrade("D");

        // ✅ optional but safe
        result.setTotalMarks(totalMarks);

        return resultRepository.save(result);
    }


    // ✅ GET ALL
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }


    // ✅ ADMIN PUBLISH
    public String publishClassResult(Long classId, String examType) {

        // ✅ convert string to enum
        ExamType type;
        try {
            type = ExamType.valueOf(examType.toUpperCase());
        } catch (Exception e) {
            return "❌ Invalid exam type";
        }

        // ✅ get ALL exams of class + type (ALL subjects)
        List<ExamSchedule> exams =
                examRepo.findByClassIdAndExamType(classId, type);

        if (exams.isEmpty()) {
            return "❌ No exams found";
        }

        // ✅ check already published
        boolean alreadyPublished = exams.stream()
                .allMatch(ex -> {
                    List<Result> results = resultRepository.findByExamId(ex.getId());

                    return !results.isEmpty() &&
                            results.stream()
                                    .allMatch(r -> "PUBLISHED".equals(r.getPublishStatus()));
                });

        if (alreadyPublished) {
            return "⚠️ Already Published";
        }

        // 🔥 VALIDATION LOOP (सबसे important)
        for (ExamSchedule exam : exams) {

            // 👉 attendance check
            List<StudentExam> students =
                    studentExamRepo.findByExamScheduleId(exam.getId());

            boolean attendancePending = students.stream()
                    .anyMatch(s -> s.getExamStatus() == null ||
                            s.getExamStatus().equals("PENDING"));

            if (attendancePending) {
                return "❌ Attendance pending in " + exam.getSubjectName();
            }

            // 👉 present students count
            long presentCount = students.stream()
                    .filter(s -> "PRESENT".equals(s.getExamStatus()))
                    .count();

            // 👉 result check
            List<Result> results =
                    resultRepository.findByExamId(exam.getId());

            if (results.isEmpty()) {
                return "❌ Marks not entered yet for " + exam.getSubjectName();
            }

            long marksCount = results.size();

            if (marksCount < presentCount) {
                return "❌ Marks pending in " + exam.getSubjectName();
            }
        }

        // ✅ PUBLISH (सब subjects एक साथ)
        for (ExamSchedule exam : exams) {

            List<Result> results =
                    resultRepository.findByExamId(exam.getId());

            results.forEach(r -> r.setPublishStatus("PUBLISHED"));

            resultRepository.saveAll(results);

            // 🔥 mark exam completed
            exam.setStatus("COMPLETED");
            examRepo.save(exam);
        }

        return "✅ All Subjects Published Successfully";
    }




    public List<ResultDTO> getOldResults(Long studentId) {

        List<Result> all =
                resultRepository.findByStudentIdAndPublishStatus(studentId, "PUBLISHED");

        if (all.isEmpty()) return new ArrayList<>();

        // 🔥 latest exam id
        Long latestExamId = all.stream()
                .map(Result::getExamId)
                .max(Long::compare)
                .orElse(null);

        // 🔥 old = latest छोड़कर बाकी
        List<Result> old = all.stream()
                .filter(r -> !r.getExamId().equals(latestExamId))
                .toList();

        List<ResultDTO> list = new ArrayList<>();

        for (Result r : old) {

            ExamSchedule exam = examRepo.findById(r.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));

            list.add(new ResultDTO(
                    r.getExamId(),
                    r.getClassId(),
                    r.getProfessorId(),
                    r.getSubject(),
                    r.getMarks(),
                    exam.getTotalMarks(),
                    r.getStatus(),
                    r.getGrade(),
                    exam.getExamType().name()
            ));
        }

        return list;
    }




    public List<ResultDTO> getStudentResultByType(Long studentId, String examType) {

        // 🔍 exam type convert
        ExamType type;
        try {
            type = ExamType.valueOf(examType.toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid exam type");
        }

        // 🔍 student class
        Long classId = getStudentClass(studentId);

        // 🔍 उस class के सारे subjects (examSchedule)
        List<ExamSchedule> exams =
                examRepo.findByClassIdAndExamType(classId, type);

        // 🔍 student के published results
        List<Result> results =
                resultRepository.findByStudentIdAndPublishStatus(studentId, "PUBLISHED");

        // 🔥 subject → result map
        Map<String, Result> resultMap = new HashMap<>();
        for (Result r : results) {
            resultMap.put(r.getSubject(), r);
        }

        List<ResultDTO> finalList = new ArrayList<>();

        // 🔥 हर subject check करो
        for (ExamSchedule ex : exams) {

            String subject = ex.getSubjectName();

            Result r = results.stream()
                    .filter(res ->
                            res.getExamId().equals(ex.getId()) &&
                                    res.getSubject().equals(subject)
                    )
                    .findFirst()
                    .orElse(null);

            if (r != null) {

                // ✅ PRESENT
                finalList.add(new ResultDTO(
                        r.getExamId(),
                        r.getClassId(),
                        r.getProfessorId(),
                        r.getSubject(),
                        r.getMarks(),
                        ex.getTotalMarks(),   // ✅ सही source
                        r.getStatus(),
                        r.getGrade(),
                        ex.getExamType().name()
                ));

            } else {

                // ❗ ABSENT
                finalList.add(new ResultDTO(
                        ex.getId(),
                        ex.getClassId(),
                        ex.getTeacherId(),
                        subject,
                        0,
                        ex.getTotalMarks(),   // ✅ DB से (correct)
                        "ABSENT",
                        "F",
                        ex.getExamType().name()
                ));
            }
        }

        // ❌ अगर student ने कोई exam नहीं दिया → empty
        boolean hasAnyPresent = finalList.stream()
                .anyMatch(r -> !"ABSENT".equals(r.getStatus()));

        if (!hasAnyPresent) {
            return new ArrayList<>();
        }

        return finalList;
    }



    private Long getStudentClass(Long studentId) {

        StudentExam se = studentExamRepo
                .findTopByStudentIdOrderByExamScheduleIdDesc(studentId);
        if (se == null) {
            throw new RuntimeException("❌ Student class not found");
        }

        // examSchedule se class nikalo
        ExamSchedule exam = examRepo.findById(se.getExamScheduleId())
                .orElseThrow(() -> new RuntimeException("❌ Exam not found"));

        return exam.getClassId();
    }


    public List<Result> getResultByClassAndType(Long classId, String examType) {

        ExamType type = ExamType.valueOf(examType.toUpperCase());

        List<ExamSchedule> exams =
                examRepo.findByClassIdAndExamType(classId, type);

        List<Result> finalList = new ArrayList<>();

        for (ExamSchedule ex : exams) {

            List<Result> results =
                    resultRepository.findByExamId(ex.getId());

            finalList.addAll(results);
        }

        return finalList;
    }
}