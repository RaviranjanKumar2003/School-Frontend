package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.TeacherAttendance;
import com.example.stud_erp.repository.TeacherAttendanceRepository;
import com.example.stud_erp.service.TeacherAttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service  // 🔥 THIS IS MUST
public class TeacherAttendanceServiceImpl implements TeacherAttendanceService {

    @Autowired
    private TeacherAttendanceRepository repository;

    @Override
    public String saveOrUpdate(List<TeacherAttendance> list) {

        for (TeacherAttendance ta : list) {

            TeacherAttendance existing =
                    repository.findByTeacherIdAndDate(
                            ta.getTeacherId(),
                            ta.getDate()
                    );

            if (existing != null) {
                existing.setStatus(ta.getStatus());
                repository.save(existing);
            } else {
                repository.save(ta);
            }
        }

        return "Saved Successfully";
    }

    @Override
    public List<TeacherAttendance> getByDate(LocalDate date) {
        return repository.findByDate(date);
    }
}