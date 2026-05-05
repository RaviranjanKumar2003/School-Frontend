package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.Attendance;
import com.example.stud_erp.entity.ClassSession;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.TeacherAttendance;
import com.example.stud_erp.payload.AttendanceDTO;
import com.example.stud_erp.payload.ClassSessionDTO;
import com.example.stud_erp.repository.AttendanceRepository;
import com.example.stud_erp.repository.ClassSessionRepository;
import com.example.stud_erp.repository.StudentRepository;
import com.example.stud_erp.service.AttendanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private ClassSessionRepository sessionRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private AttendanceRepository attendanceRepository;

    // 🔥 SAVE ATTENDANCE
    @Override
    public ClassSessionDTO saveAttendance(ClassSessionDTO dto) {

        // 🔥 Duplicate check
        ClassSession existing = sessionRepo
                .findByClassNumberAndDateAndSubject(
                        dto.getClassNumber(),
                        dto.getDate(),
                        dto.getSubject()
                ).orElse(null);

        ClassSession session = (existing != null) ? existing : new ClassSession();

        session.setLecturer(dto.getLecturer());
        session.setSubject(dto.getSubject());
        session.setClassNumber(dto.getClassNumber());
        session.setDate(dto.getDate());
        session.setTime(dto.getTime());

        List<Attendance> attendanceList = new ArrayList<>();

        for (AttendanceDTO a : dto.getStudents()) {

            Student student = studentRepo.findById(a.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            Attendance att = new Attendance();
            att.setStudent(student);
            att.setStatus(a.getStatus());
            att.setClassSession(session);

            attendanceList.add(att);
        }

        session.setAttendance(attendanceList);

        ClassSession saved = sessionRepo.save(session);

        return mapToDTO(saved);
    }

    // 🔥 CLASS ATTENDANCE
    @Override
    public List<ClassSessionDTO> getClassAttendance(Integer classNumber) {

        return sessionRepo.findByClassNumber(classNumber)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // 🔥 STUDENT ATTENDANCE
    @Override
    public List<ClassSessionDTO> getStudentAttendance(Long studentId) {

        List<Attendance> list = attendanceRepo.findByStudent_Id(studentId);

        return list.stream()
                .map(att -> mapToDTO(att.getClassSession()))
                .distinct()
                .toList();
    }

    // ================= MAPPER =================

    private ClassSessionDTO mapToDTO(ClassSession session) {

        ClassSessionDTO dto = new ClassSessionDTO();

        dto.setId(session.getId());
        dto.setLecturer(session.getLecturer());
        dto.setSubject(session.getSubject());
        dto.setClassNumber(session.getClassNumber());
        dto.setDate(session.getDate());
        dto.setTime(session.getTime());

        List<AttendanceDTO> students = session.getAttendance().stream().map(a -> {
            AttendanceDTO ad = new AttendanceDTO();
            ad.setStudentId(a.getStudent().getId());
            ad.setStudentName(a.getStudent().getStudName());
            ad.setStatus(a.getStatus());
            return ad;
        }).toList();

        dto.setStudents(students);

        return dto;
    }

    @Override
    public List<Attendance> getByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    @Override
    public ClassSessionDTO getClassAttendanceByDate(Integer classNumber, LocalDate date) {

        List<Attendance> records = attendanceRepository
                .findByClassNumberAndDate(classNumber, date);

        if (records.isEmpty()) {
            return null;
        }

        ClassSessionDTO dto = new ClassSessionDTO();
        dto.setClassNumber(classNumber);
        dto.setDate(date);

        List<AttendanceDTO> students = records.stream().map(a -> {
            AttendanceDTO s = new AttendanceDTO();

            s.setStudentId(a.getStudent().getId());
            s.setStudentName(a.getStudent().getStudName());
            s.setStudRollNo(a.getStudent().getStudRollNo());
            s.setStatus(a.getStatus());

            return s;
        }).toList();

        dto.setStudents(students);

        return dto;
    }

}