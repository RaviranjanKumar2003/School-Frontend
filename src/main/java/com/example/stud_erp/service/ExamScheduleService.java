package com.example.stud_erp.service;
import com.example.stud_erp.entity.*;
import com.example.stud_erp.enums.ExamType;
import com.example.stud_erp.payload.ExamScheduleDTO;
import com.example.stud_erp.payload.ExamStatusDTO;
import com.example.stud_erp.payload.StudentExamAttendanceDTO;
import com.example.stud_erp.payload.StudentExamDTO;
import com.example.stud_erp.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalTime;
import java.util.List;

@Service
public class ExamScheduleService {

    @Autowired
    private ExamScheduleRepository repo;

    @Autowired
    private StudentExamRepository studentExamRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private ClassRepository classRepo;

    @Autowired
    private ProfessorRepository professorRepo;

    @Autowired
    private ResultRepository resultRepo;

    @Autowired
    private SubjectRepository subjectRepo;


    // ✅ CREATE
    public void createSchedule(ExamSchedule req) {

        if (req.getTeacherId() == null) {
            throw new RuntimeException("❌ Teacher ID missing");
        }

        if (req.getExamType() == null) {
            throw new RuntimeException("❌ Exam type required");
        }

        // 🔥 CHECK SUBJECT BELONGS TO CLASS
        List<Subject> classSubjects =
                subjectRepo.findByClassEntityId(req.getClassId());

        boolean subjectExists = classSubjects.stream()
                .anyMatch(s ->
                        s.getSubjectName().trim()
                                .equalsIgnoreCase(req.getSubjectName().trim())
                );

        if (!subjectExists) {
            throw new RuntimeException(
                    "❌ This subject does not belong to selected class"
            );
        }

        // 🔥 SAME TYPE + SAME CLASS
        List<ExamSchedule> old =
                repo.findByClassIdAndExamType(
                        req.getClassId(),
                        req.getExamType()
                );

        // 🔥 SAME SUBJECT CHECK (IGNORE CANCELLED)
        boolean alreadyExists = old.stream()
                .anyMatch(e ->
                        e.getSubjectName().trim()
                                .equalsIgnoreCase(req.getSubjectName().trim())
                                &&
                                !("COMPLETED".equalsIgnoreCase(e.getStatus())
                                        || "CANCELLED".equalsIgnoreCase(e.getStatus()))
                );
        if (alreadyExists) {
            throw new RuntimeException(
                    "❌ This subject already has " + req.getExamType() + " exam"
            );
        }

        // 🔥 DATE + TIME VALIDATION
        List<ExamSchedule> existingExams =
                repo.findByClassIdAndExamDate(
                        req.getClassId(),
                        req.getExamDate()
                );

        LocalTime newStart = LocalTime.parse(req.getStartTime());
        LocalTime newEnd = newStart.plusMinutes(req.getDuration());

        for (ExamSchedule ex : existingExams) {

            LocalTime oldStart = LocalTime.parse(ex.getStartTime());
            LocalTime oldEnd = oldStart.plusMinutes(ex.getDuration());

            boolean overlap =
                    !(newEnd.isBefore(oldStart) || newStart.isAfter(oldEnd));

            if (overlap) {
                throw new RuntimeException(
                        "❌ Time clash! Exam already from " +
                                oldStart + " to " + oldEnd
                );
            }

            if (ex.getShift().equalsIgnoreCase(req.getShift())) {
                throw new RuntimeException(
                        "❌ Shift already used for this date"
                );
            }
        }

        // ✅ SAVE
        ExamSchedule saved = repo.save(req);

        // 🔥 AUTO STUDENT ASSIGN
        String className = classRepo.findById(req.getClassId())
                .get()
                .getClassName();

        Integer classNumber = Integer.parseInt(className);

        List<Student> students =
                studentRepo.findByClassNumber(classNumber);

        for (Student s : students) {
            StudentExam se = new StudentExam();
            se.setStudentId(s.getId());
            se.setExamScheduleId(saved.getId());
            se.setExamStatus("PENDING");
            studentExamRepo.save(se);
        }
    }





    public List<StudentExamDTO> getStudentExams(Long studentId) {

        List<StudentExam> list =
                studentExamRepo.findByStudentId(studentId);

        return list.stream().map(se -> {

            ExamSchedule ex = repo.findById(se.getExamScheduleId())
                    .orElseThrow();

            StudentExamDTO dto = new StudentExamDTO();

            dto.setId(se.getId());
            dto.setStatus(se.getExamStatus());
            dto.setCancelReason(ex.getCancelReason());
            dto.setSubjectName(ex.getSubjectName());
            dto.setExamDate(ex.getExamDate());
            dto.setStartTime(ex.getStartTime());
            dto.setShift(ex.getShift());
            dto.setDuration(ex.getDuration());
            dto.setTotalMarks(ex.getTotalMarks());

            dto.setMode(ex.getMode());
            dto.setRoomNo(ex.getRoomNo());
            dto.setMeetingLink(ex.getMeetingLink());

            dto.setMessage(ex.getMessage()); // ✅ (agar add kiya hai)

            // 🔥 ADD THIS (END TIME)
            try {
                LocalTime start = LocalTime.parse(ex.getStartTime());
                LocalTime end = start.plusMinutes(ex.getDuration());
                dto.setEndTime(end.toString());
            } catch (Exception e) {
                dto.setEndTime("-");
            }

            // 🔥 ADD THIS (TEACHER NAME)
            professorRepo.findById(ex.getTeacherId())
                    .ifPresent(t -> dto.setTeacherName(t.getName()));

            return dto;

        }).toList();
    }

    // ✅ UPDATE
    public void update(Long id, ExamSchedule req) {

        ExamSchedule current = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // 🔥 1. RESULT LOCK
        List<Result> results = resultRepo.findByExamId(id);
        if (!results.isEmpty()) {
            throw new RuntimeException(
                    "❌ Cannot update. Marks already submitted"
            );
        }

        // 🔥 2. ATTENDANCE LOCK
        List<StudentExam> students =
                studentExamRepo.findByExamScheduleId(id);

        boolean attendanceDone = students.stream()
                .anyMatch(s -> !"PENDING".equals(s.getExamStatus()));

        if (attendanceDone) {
            throw new RuntimeException(
                    "❌ Cannot update. Attendance already marked"
            );
        }

        // 🔥 3. TIME + SHIFT VALIDATION (same as before)
        List<ExamSchedule> existingExams =
                repo.findByClassIdAndExamDate(
                        req.getClassId(),
                        req.getExamDate()
                );

        LocalTime newStart = LocalTime.parse(req.getStartTime());
        LocalTime newEnd = newStart.plusMinutes(req.getDuration());

        for (ExamSchedule ex : existingExams) {

            if (ex.getId().equals(id)) continue;

            if (ex.getShift().equalsIgnoreCase(req.getShift())) {
                throw new RuntimeException(
                        "❌ This shift already has an exam"
                );
            }

            LocalTime oldStart = LocalTime.parse(ex.getStartTime());
            LocalTime oldEnd = oldStart.plusMinutes(ex.getDuration());

            boolean overlap =
                    !(newEnd.isBefore(oldStart) || newStart.isAfter(oldEnd));

            if (overlap) {
                throw new RuntimeException(
                        "❌ Time clash! " + oldStart + " to " + oldEnd
                );
            }
        }

        // ✅ UPDATE
        current.setExamDate(req.getExamDate());
        current.setShift(req.getShift());
        current.setStartTime(req.getStartTime());
        current.setDuration(req.getDuration());
        current.setTotalMarks(req.getTotalMarks());
        current.setMode(req.getMode());
        current.setRoomNo(req.getRoomNo());
        current.setMeetingLink(req.getMeetingLink());
        current.setMessage(req.getMessage());

        repo.save(current);
    }
    // DELETE
    public void delete(Long id) {

        ExamSchedule exam = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // 🔥 1. RESULT LOCK
        List<Result> results = resultRepo.findByExamId(id);
        if (!results.isEmpty()) {
            throw new RuntimeException(
                    "❌ Cannot delete. Marks already submitted"
            );
        }

        // 🔥 2. ATTENDANCE LOCK
        List<StudentExam> students =
                studentExamRepo.findByExamScheduleId(id);

        boolean attendanceDone = students.stream()
                .anyMatch(s -> !"PENDING".equals(s.getExamStatus()));

        if (attendanceDone) {
            throw new RuntimeException(
                    "❌ Cannot delete. Attendance already marked"
            );
        }

        // 🔥 3. SAFE DELETE (student exams भी हटाओ)
        studentExamRepo.deleteAll(students);

        repo.deleteById(id);
    }

    // TEACHER VIEW
    public List<ExamSchedule> getTeacher(Long teacherId) {
        return repo.findByTeacherId(teacherId);
    }
   // ALL TEACHER VIEW
   public List<ExamScheduleDTO> getAllExams() {

       List<ExamSchedule> list = repo.findAll();

       return list.stream().map(e -> {

           ExamScheduleDTO dto = new ExamScheduleDTO();

           dto.setId(e.getId());
           dto.setSubjectName(e.getSubjectName());
           dto.setTeacherId(e.getTeacherId());
           dto.setTotalMarks(e.getTotalMarks());
           dto.setExamDate(e.getExamDate());
           dto.setStartTime(e.getStartTime());
           dto.setDuration(e.getDuration());
           dto.setShift(e.getShift());
           dto.setMode(e.getMode());
           dto.setRoomNo(e.getRoomNo());
           dto.setMessage(e.getMessage());
           dto.setStatus(e.getStatus());

           // ✅ CLASS NAME
           dto.setClassName("Unknown");
           if (e.getClassId() != null) {
               classRepo.findById(e.getClassId())
                       .ifPresent(c -> dto.setClassName(c.getClassName()));
           }

           // ✅ TEACHER NAME
           dto.setTeacherName("Unknown");
           if (e.getTeacherId() != null) {
               professorRepo.findById(e.getTeacherId())
                       .ifPresent(t -> dto.setTeacherName(t.getName()));
           }

           // 🔥 END TIME CALCULATION
           try {
               LocalTime start = LocalTime.parse(e.getStartTime());
               LocalTime end = start.plusMinutes(e.getDuration());
               dto.setEndTime(end.toString());
           } catch (Exception ex) {
               dto.setEndTime("-");
           }
           return dto;

       }).toList();
   }


    // ✅ CANCEL (FULL SAFE)
    public void cancel(Long id, String reason) {

        ExamSchedule ex = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // 🔥 1. RESULT CHECK
        List<Result> results = resultRepo.findByExamId(id);

        if (!results.isEmpty()) {
            throw new RuntimeException(
                    "❌ Cannot cancel. Marks already submitted"
            );
        }

        // 🔥 2. ATTENDANCE CHECK
        List<StudentExam> students =
                studentExamRepo.findByExamScheduleId(id);

        boolean attendanceDone = students.stream()
                .anyMatch(s -> !"PENDING".equals(s.getExamStatus()));

        if (attendanceDone) {
            throw new RuntimeException(
                    "❌ Cannot cancel. Attendance already marked"
            );
        }

        // ✅ SAFE CANCEL
        ex.setStatus("CANCELLED");
        ex.setCancelReason(reason);
        repo.save(ex);

        // 🔥 update student exams
        for (StudentExam se : students) {
            se.setExamStatus("CANCELLED");
        }

        studentExamRepo.saveAll(students);
    }


    public void markAttendance(StudentExam req) {

        StudentExam se = studentExamRepo.findById(req.getId())
                .orElseThrow();

        se.setExamStatus(req.getExamStatus()); // GIVEN / ABSENT

        studentExamRepo.save(se);
    }

    public List<StudentExamAttendanceDTO> getStudentsByClass(
            Long classId,
            Long teacherId
    ) {

        ExamSchedule latestExam =
                repo.findTopByClassIdAndTeacherIdOrderByIdDesc(
                        classId, teacherId
                );

        if (latestExam == null) {
            throw new RuntimeException("❌ This class has no exam for you");
        }

        // 🔥 ADD THIS (EXAM DATE CHECK)
//        if (!latestExam.getExamDate().equals(java.time.LocalDate.now().toString())) {
//            throw new RuntimeException("❌ Your Exam is not scheduled for today");
//        }

        List<StudentExam> list =
                studentExamRepo.findByExamScheduleId(latestExam.getId());

        return list.stream().map(se -> {

            StudentExamAttendanceDTO dto =
                    new StudentExamAttendanceDTO();

            dto.setId(se.getId());
            dto.setExamStatus(se.getExamStatus());

            studentRepo.findById(se.getStudentId())
                    .ifPresent(s -> {
                        dto.setStudentName(s.getStudName());

                        dto.setImageUrl("http://localhost:8080/uploads/" + s.getImageUrl());

                        dto.setStudentId(se.getStudentId()); // 🔥 THIS WAS MISSING

                        System.out.println(s.getImageUrl());
                    });

            dto.setSubjectName(latestExam.getSubjectName());

            return dto;

        }).toList();
    }

    public List<StudentExamAttendanceDTO> getStudentsForResult(
            Long classId,
            Long teacherId
    ) {

        // 🔥 FIX: exam define करो
        ExamSchedule exam =
                repo.findTopByClassIdAndTeacherIdOrderByIdDesc(
                        classId, teacherId
                );

        if (exam == null) {
            throw new RuntimeException("No exam found");
        }

        List<StudentExam> list =
                studentExamRepo.findByExamScheduleId(exam.getId());

        return list.stream().map(se -> {

            StudentExamAttendanceDTO dto =
                    new StudentExamAttendanceDTO();

            dto.setId(se.getId());
            dto.setExamStatus(se.getExamStatus());

            dto.setSubjectName(exam.getSubjectName());
            dto.setExamScheduleId(exam.getId());

            // 🔥 ADD THIS LINE
            dto.setTotalMarks(exam.getTotalMarks());

            studentRepo.findById(se.getStudentId())
                    .ifPresent(s -> {
                        dto.setStudentName(s.getStudName());
                        dto.setStudentId(s.getId());
                    });

            return dto;

        }).toList();
    }



    public List<ExamStatusDTO> getClassExamStatus(Long classId, String examType) {

        ExamType type = ExamType.valueOf(examType.toUpperCase());

        List<Subject> subjects = subjectRepo.findByClassEntityId(classId);
        List<ExamSchedule> exams = repo.findByClassIdAndExamType(classId, type);

        return subjects.stream().map(sub -> {

            ExamStatusDTO dto = new ExamStatusDTO();
            dto.setSubjectName(sub.getSubjectName());

            ExamSchedule exam = exams.stream()
                    .filter(e ->
                            e.getSubjectName().trim()
                                    .equalsIgnoreCase(sub.getSubjectName().trim())
                    )
                    .findFirst()
                    .orElse(null);

            if (exam == null) {
                dto.setStatus("NOT_SCHEDULED");
                return dto;
            }

            // ✅ ADD THIS BLOCK 👇
            dto.setExamDate(exam.getExamDate());
            dto.setStartTime(exam.getStartTime());
            dto.setShift(exam.getShift());
            dto.setMode(exam.getMode());
            dto.setRoomNo(exam.getRoomNo());
            dto.setMeetingLink(exam.getMeetingLink());

            // ✅ TEACHER NAME FIX
            if (exam.getTeacherId() != null) {
                professorRepo.findById(exam.getTeacherId())
                        .ifPresent(t -> dto.setTeacherName(t.getName()));
            }

            // 🔥 EXISTING LOGIC
            List<StudentExam> students =
                    studentExamRepo.findByExamScheduleId(exam.getId());

            boolean attendanceDone = students.stream()
                    .allMatch(s -> !"PENDING".equals(s.getExamStatus()));

            if (!attendanceDone) {
                dto.setStatus("ATTENDANCE_PENDING");
                return dto;
            }

            long presentCount = students.stream()
                    .filter(s -> "PRESENT".equalsIgnoreCase(s.getExamStatus()))
                    .count();

            List<Result> results =
                    resultRepo.findByExamId(exam.getId());

            long resultCount = results.size();

            if (resultCount < presentCount) {
                dto.setStatus("MARKS_PENDING");
            } else {

                if (!"COMPLETED".equalsIgnoreCase(exam.getStatus())) {
                    exam.setStatus("COMPLETED");
                    repo.save(exam);
                }

                dto.setStatus("COMPLETED");
            }

            return dto;

        }).toList();
    }

}