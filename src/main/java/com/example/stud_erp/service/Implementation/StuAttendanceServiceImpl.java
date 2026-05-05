package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.StuAttendance;
import com.example.stud_erp.payload.StuAttendanceDTO;
import com.example.stud_erp.repository.StudentRepository;
import com.example.stud_erp.repository.StuAttendanceRepository;
import com.example.stud_erp.service.StuAttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class StuAttendanceServiceImpl implements StuAttendanceService {

    @Autowired
    private StuAttendanceRepository repo;

    @Autowired
    private StudentRepository studentRepo;

    @Override
    public String save(Integer classNumber, LocalDate date, List<StuAttendanceDTO> list) {

        List<StuAttendance> records = list.stream().map(s -> {

            Student student = studentRepo.findById(s.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + s.getStudentId()));

            StuAttendance a = new StuAttendance();
            a.setClassNumber(classNumber);
            a.setDate(date);
            a.setStudent(student);
            a.setStatus(s.getStatus());

            return a;

        }).toList();

        repo.saveAll(records);

        return "Saved Successfully";
    }

    @Override
    public List<StuAttendanceDTO> getByClassAndDate(Integer classNumber, LocalDate date) {

        return repo.findByClassNumberAndDate(classNumber, date)
                .stream()
                .map(a -> {
                    StuAttendanceDTO dto = new StuAttendanceDTO();
                    dto.setStudentId(a.getStudent().getId());
                    dto.setStudentName(a.getStudent().getStudName());
                    dto.setStudentLastName(a.getStudent().getStudLastName());
                    dto.setEmail(a.getStudent().getEmail());
                    dto.setStudRollNo(a.getStudent().getStudRollNo());
                    dto.setStatus(a.getStatus());
                    return dto;
                }).toList();
    }
}