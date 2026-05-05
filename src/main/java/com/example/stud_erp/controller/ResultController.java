package com.example.stud_erp.controller;

import com.example.stud_erp.entity.ExamSchedule;
import com.example.stud_erp.entity.Result;
import com.example.stud_erp.entity.RecheckRequest;
import com.example.stud_erp.payload.ResultDTO;
import com.example.stud_erp.repository.ResultRepository;
import com.example.stud_erp.repository.RecheckRepository;

import com.example.stud_erp.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@CrossOrigin("*")
public class ResultController {

    @Autowired
    private ResultRepository repo;

    @Autowired
    private RecheckRepository recheckRepo;

    @Autowired
    private ResultService resultService;



    @PostMapping
    public ResponseEntity<?> save(@RequestBody Result r) {
        try {
            return ResponseEntity.ok(resultService.saveMarks(r));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @GetMapping("/full/student/{studentId}")
    public List<ResultDTO> getFullResult(@PathVariable Long studentId) {
        return resultService.getStudentFullResult(studentId);
    }

    // ✅ GET BY STUDENT
    @GetMapping("/student/{id}/{examType}")
    public List<ResultDTO> getByStudentAndType(
            @PathVariable Long id,
            @PathVariable String examType
    ) {
        return resultService.getStudentResultByType(id, examType);
    }


    // ✅ GET ALL
    @GetMapping
    public List<Result> getAll() {
        return repo.findAll();
    }

    // 🔥 UPDATE MARKS (RECHECK MAIN FEATURE)
    @PutMapping("/update-marks")
    public Result updateMarks(
            @RequestParam Long studentId,
            @RequestParam String subject,
            @RequestParam int newMarks,
            @RequestParam Long requestId,
            @RequestParam Long professorId
    ) {

        // 🔍 find result
        Result result = repo
                .findByStudentIdAndSubject(studentId, subject)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        // ❌ validation
        if (newMarks < 0) {
            throw new RuntimeException("Marks cannot be negative");
        }

        if (newMarks > result.getTotalMarks()) {
            throw new RuntimeException("Marks cannot exceed total marks");
        }

        // 🔥 update marks
        result.setMarks(newMarks);
        Result updated = repo.save(result);

        // 🔥 mark recheck as COMPLETED
        RecheckRequest req = recheckRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setProfessorId(professorId);
        req.setStatus("COMPLETED");
        recheckRepo.save(req);

        return updated;
    }

    //    Admin public student result
    @PutMapping("/publish/class/{classId}/{examType}")
    public String publishClass(
            @PathVariable Long classId,
            @PathVariable String examType
    ) {
        return resultService.publishClassResult(classId, examType);
    }

    @GetMapping("/class/{classId}/{examType}")
    public List<Result> getByClassAndType(
            @PathVariable Long classId,
            @PathVariable String examType
    ) {
        return resultService.getResultByClassAndType(classId, examType);
    }
}