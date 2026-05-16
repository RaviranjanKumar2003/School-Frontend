package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.ClassEntity;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.entity.StuAttendance;
import com.example.stud_erp.payload.StuAttendanceDTO;
import com.example.stud_erp.repository.ClassRepository;
import com.example.stud_erp.repository.StudentRepository;
import com.example.stud_erp.repository.StuAttendanceRepository;
import com.example.stud_erp.service.StuAttendanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
@Transactional
public class StuAttendanceServiceImpl
        implements StuAttendanceService {

    @Autowired
    private StuAttendanceRepository repo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private ClassRepository classRepo;

    // =========================================================
    // SAVE MANUAL ATTENDANCE
    // =========================================================

    @Override
    public String save(

            Long schoolId,

            Long classId,

            String section,

            LocalDate attendanceDate,

            Long takenById,

            String takenByName,

            String takenByRole,

            List<StuAttendanceDTO> list
    ) {

        validateRole(takenByRole);

        ClassEntity classEntity =
                classRepo.findById(classId)
                        .orElseThrow(() ->
                                new RuntimeException("Class not found")
                        );

        for (StuAttendanceDTO dto : list) {

            Student student =
                    studentRepo.findById(dto.getStudentId())
                            .orElseThrow(() ->
                                    new RuntimeException("Student not found")
                            );

            // =====================================================
            // VALIDATIONS
            // =====================================================

            if (!student.getSchool().getId().equals(schoolId)) {

                throw new RuntimeException(
                        student.getFullName()
                                + " belongs to another school"
                );
            }

            if (
                    !student.getClassEntity().getId()
                            .equals(classId)
            ) {

                throw new RuntimeException(
                        student.getFullName()
                                + " belongs to another class"
                );
            }

            if (
                    student.getSection() == null
                            ||
                            !student.getSection()
                                    .equalsIgnoreCase(section)
            ) {

                throw new RuntimeException(
                        student.getFullName()
                                + " belongs to another section"
                );
            }

            // =====================================================
            // EXISTING CHECK
            // =====================================================

            Optional<StuAttendance> existingOpt =
                    repo.findByStudent_IdAndAttendanceDateAndClassIdAndSection(
                            student.getId(),
                            attendanceDate,
                            classId,
                            section
                    );

            // =====================================================
            // UPDATE
            // =====================================================

            if (existingOpt.isPresent()) {

                StuAttendance existing =
                        existingOpt.get();

                existing.setStatus(dto.getStatus());

                existing.setUpdatedBy(takenById);

                existing.setUpdatedByName(takenByName);

                existing.setUpdatedByRole(takenByRole);

                existing.setUpdatedDate(LocalDate.now());

                repo.save(existing);
            }

            // =====================================================
            // INSERT
            // =====================================================

            else {

                StuAttendance attendance =
                        new StuAttendance();

                attendance.setSchoolId(
                        student.getSchool().getId()
                );

                attendance.setSchoolName(
                        student.getSchool().getSchoolName()
                );

                attendance.setClassId(classId);

                attendance.setClassName(
                        classEntity.getClassName()
                );

                attendance.setSection(section);

                attendance.setAttendanceDate(
                        attendanceDate
                );

                attendance.setStudent(student);

                attendance.setStatus(dto.getStatus());

                // CREATED

                attendance.setCreatedBy(takenById);

                attendance.setCreatedByName(
                        takenByName
                );

                attendance.setCreatedByRole(
                        takenByRole
                );

                attendance.setCreatedDate(
                        LocalDate.now()
                );

                // UPDATED

                attendance.setUpdatedBy(takenById);

                attendance.setUpdatedByName(
                        takenByName
                );

                attendance.setUpdatedByRole(
                        takenByRole
                );

                attendance.setUpdatedDate(
                        LocalDate.now()
                );

                repo.save(attendance);
            }
        }

        return "Attendance Saved Successfully";
    }

    // =========================================================
    // QR SCAN ATTENDANCE
    // =========================================================

    @Override
    public String markAttendanceByQr(

            String studentId,

            Long schoolId,

            Long takenById,

            String takenByName,

            String takenByRole
    ) {

        validateRole(takenByRole);

        Student student =
                studentRepo.findByStudentId(studentId)
                        .orElseThrow(() ->
                                new RuntimeException("Student not found")
                        );

        if (
                !student.getSchool().getId()
                        .equals(schoolId)
        ) {

            throw new RuntimeException(
                    "Student belongs to another school"
            );
        }

        LocalDate today = LocalDate.now();

        Optional<StuAttendance> existingOpt =
                repo.findByStudent_IdAndAttendanceDateAndClassIdAndSection(
                        student.getId(),
                        today,
                        student.getClassEntity().getId(),
                        student.getSection()
                );

        if (existingOpt.isPresent()) {

            return "Attendance already marked";
        }

        StuAttendance attendance =
                new StuAttendance();

        attendance.setSchoolId(
                student.getSchool().getId()
        );

        attendance.setSchoolName(
                student.getSchool().getSchoolName()
        );

        attendance.setClassId(
                student.getClassEntity().getId()
        );

        attendance.setClassName(
                student.getClassName()
        );

        attendance.setSection(
                student.getSection()
        );

        attendance.setAttendanceDate(today);

        attendance.setStudent(student);

        attendance.setStatus("P");

        // CREATED

        attendance.setCreatedBy(takenById);

        attendance.setCreatedByName(
                takenByName
        );

        attendance.setCreatedByRole(
                takenByRole
        );

        attendance.setCreatedDate(
                LocalDate.now()
        );

        // UPDATED

        attendance.setUpdatedBy(takenById);

        attendance.setUpdatedByName(
                takenByName
        );

        attendance.setUpdatedByRole(
                takenByRole
        );

        attendance.setUpdatedDate(
                LocalDate.now()
        );

        repo.save(attendance);

        return "Attendance Marked Successfully";
    }

    // =========================================================
    // GET BY CLASS + DATE
    // =========================================================

    @Override
    public List<StuAttendanceDTO> getByClassAndDate(

            Long schoolId,

            Long classId,

            String section,

            LocalDate attendanceDate
    ) {

        return repo
                .findBySchoolIdAndClassIdAndSectionAndAttendanceDate(
                        schoolId,
                        classId,
                        section,
                        attendanceDate
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // GET BY DATE
    // =========================================================

    @Override
    public List<StuAttendance> getByDate(

            Long schoolId,

            LocalDate attendanceDate
    ) {

        return repo.findBySchoolIdAndAttendanceDate(
                schoolId,
                attendanceDate
        );
    }

    // =========================================================
    // STUDENT ATTENDANCE HISTORY
    // =========================================================

    @Override
    public List<StuAttendanceDTO> getStudentAttendance(
            Long studentId
    ) {

        return repo.findByStudent_Id(studentId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // SECTION ATTENDANCE
    // =========================================================

    @Override
    public List<StuAttendanceDTO> getSectionAttendance(

            Long schoolId,

            String section,

            LocalDate attendanceDate
    ) {

        return repo
                .findBySchoolIdAndSectionAndAttendanceDate(
                        schoolId,
                        section,
                        attendanceDate
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // PRESENT STUDENTS
    // =========================================================

    @Override
    public List<StuAttendanceDTO> getPresentStudents(

            Long schoolId,

            LocalDate attendanceDate
    ) {

        return repo
                .findBySchoolIdAndAttendanceDate(
                        schoolId,
                        attendanceDate
                )
                .stream()
                .filter(a ->
                        "P".equalsIgnoreCase(
                                a.getStatus()
                        )
                )
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // ABSENT STUDENTS
    // =========================================================

    @Override
    public List<StuAttendanceDTO> getAbsentStudents(

            Long schoolId,

            LocalDate attendanceDate
    ) {

        return repo
                .findBySchoolIdAndAttendanceDate(
                        schoolId,
                        attendanceDate
                )
                .stream()
                .filter(a ->
                        "A".equalsIgnoreCase(
                                a.getStatus()
                        )
                )
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // UPDATE ATTENDANCE
    // =========================================================

    @Override
    public String updateAttendance(

            Long attendanceId,

            String status,

            Long updatedById,

            String updatedByName,

            String updatedByRole
    ) {

        StuAttendance attendance =
                repo.findById(attendanceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found"
                                )
                        );

        attendance.setStatus(status);

        attendance.setUpdatedBy(updatedById);

        attendance.setUpdatedByName(updatedByName);

        attendance.setUpdatedByRole(updatedByRole);

        attendance.setUpdatedDate(LocalDate.now());

        repo.save(attendance);

        return "Attendance Updated Successfully";
    }

    // =========================================================
    // DELETE ATTENDANCE
    // =========================================================

    @Override
    public String deleteAttendance(
            Long attendanceId
    ) {

        repo.deleteById(attendanceId);

        return "Attendance Deleted Successfully";
    }

    // =========================================================
    // TODAY SUMMARY
    // =========================================================

    @Override
    public Map<String, Object> getTodaySummary(
            Long schoolId
    ) {

        return getSummaryByDate(
                schoolId,
                LocalDate.now()
        );
    }

    // =========================================================
    // DATE SUMMARY
    // =========================================================

    @Override
    public Map<String, Object> getSummaryByDate(

            Long schoolId,

            LocalDate attendanceDate
    ) {

        List<StuAttendance> list =
                repo.findBySchoolIdAndAttendanceDate(
                        schoolId,
                        attendanceDate
                );

        long present =
                list.stream()
                        .filter(a ->
                                "P".equalsIgnoreCase(
                                        a.getStatus()
                                )
                        )
                        .count();

        long absent =
                list.size() - present;

        Map<String, Object> map =
                new HashMap<>();

        map.put(
                "attendanceDate",
                attendanceDate
        );

        map.put("total", list.size());

        map.put("present", present);

        map.put("absent", absent);

        return map;
    }

    // =========================================================
    // WEEKLY SUMMARY
    // =========================================================

    @Override
    public List<Map<String, Object>> getWeeklySummary(
            Long schoolId
    ) {

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (int i = 6; i >= 0; i--) {

            LocalDate date =
                    LocalDate.now().minusDays(i);

            result.add(
                    getSummaryByDate(
                            schoolId,
                            date
                    )
            );
        }

        return result;
    }

    // =========================================================
    // MONTHLY SUMMARY
    // =========================================================

    @Override
    public List<Map<String, Object>> getMonthlySummary(
            Long schoolId
    ) {

        List<Map<String, Object>> result =
                new ArrayList<>();

        YearMonth currentMonth =
                YearMonth.now();

        for (int i = 1;
             i <= currentMonth.lengthOfMonth();
             i++) {

            LocalDate date =
                    currentMonth.atDay(i);

            result.add(
                    getSummaryByDate(
                            schoolId,
                            date
                    )
            );
        }

        return result;
    }

    // =========================================================
    // PRESENT COUNT
    // =========================================================

    @Override
    public long getPresentCount(

            Long schoolId,

            LocalDate attendanceDate
    ) {

        return repo
                .findBySchoolIdAndAttendanceDate(
                        schoolId,
                        attendanceDate
                )
                .stream()
                .filter(a ->
                        "P".equalsIgnoreCase(
                                a.getStatus()
                        )
                )
                .count();
    }

    // =========================================================
    // ABSENT COUNT
    // =========================================================

    @Override
    public long getAbsentCount(

            Long schoolId,

            LocalDate attendanceDate
    ) {

        return repo
                .findBySchoolIdAndAttendanceDate(
                        schoolId,
                        attendanceDate
                )
                .stream()
                .filter(a ->
                        "A".equalsIgnoreCase(
                                a.getStatus()
                        )
                )
                .count();
    }

    // =========================================================
    // ATTENDANCE CHECK
    // =========================================================

    @Override
    public boolean isAttendanceMarked(

            Long studentId,

            LocalDate attendanceDate
    ) {

        return repo.existsByStudent_IdAndAttendanceDate(
                studentId,
                attendanceDate
        );
    }

    // =========================================================
    // GET SINGLE ATTENDANCE
    // =========================================================

    @Override
    public StuAttendanceDTO getAttendanceById(
            Long attendanceId
    ) {

        StuAttendance attendance =
                repo.findById(attendanceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found"
                                )
                        );

        return convertToDTO(attendance);
    }

    // =========================================================
    // CLASS ATTENDANCE COUNT
    // =========================================================

    @Override
    public long getClassAttendanceCount(

            Long schoolId,

            Long classId,

            String section,

            LocalDate attendanceDate
    ) {

        return repo
                .findBySchoolIdAndClassIdAndSectionAndAttendanceDate(
                        schoolId,
                        classId,
                        section,
                        attendanceDate
                )
                .size();
    }

    // =========================================================
    // DELETE DATE ATTENDANCE
    // =========================================================

    @Override
    public String deleteAttendanceByDate(

            Long schoolId,

            LocalDate attendanceDate
    ) {

        List<StuAttendance> list =
                repo.findBySchoolIdAndAttendanceDate(
                        schoolId,
                        attendanceDate
                );

        repo.deleteAll(list);

        return "Attendance Deleted Successfully";
    }

    // =========================================================
    // DTO CONVERTER
    // =========================================================

    private StuAttendanceDTO convertToDTO(
            StuAttendance a
    ) {

        StuAttendanceDTO dto =
                new StuAttendanceDTO();

        // ATTENDANCE

        dto.setAttendanceId(a.getId());

        dto.setAttendanceDate(
                a.getAttendanceDate()
        );

        dto.setStatus(a.getStatus());

        // SCHOOL

        dto.setSchoolId(a.getSchoolId());

        dto.setSchoolName(a.getSchoolName());

        // CLASS

        dto.setClassId(a.getClassId());

        dto.setClassName(a.getClassName());

        dto.setSection(a.getSection());

        // STUDENT

        dto.setStudentId(
                a.getStudent().getId()
        );

        dto.setStudentIdNumber(
                a.getStudent().getStudentId()
        );

        dto.setStudentName(
                a.getStudent().getStudfirstName()
        );

        dto.setStudentLastName(
                a.getStudent().getStudlastName()
        );

        dto.setFullName(
                a.getStudent().getFullName()
        );

        dto.setEmail(
                a.getStudent().getEmail()
        );

        dto.setStudRollNo(
                a.getStudent().getStudRollNo()
        );

        dto.setProfileImage(
                a.getStudent().getProfileImage()
        );

        dto.setQrCodeUrl(
                a.getStudent().getQrCodeUrl()
        );

        // CREATED

        dto.setTakenById(
                a.getCreatedBy()
        );

        dto.setTakenByName(
                a.getCreatedByName()
        );

        dto.setTakenByRole(
                a.getCreatedByRole()
        );

        // UPDATED

        dto.setUpdatedById(
                a.getUpdatedBy()
        );

        dto.setUpdatedByName(
                a.getUpdatedByName()
        );

        dto.setUpdatedByRole(
                a.getUpdatedByRole()
        );

        dto.setCreatedDate(
                a.getCreatedDate()
        );

        dto.setUpdatedDate(
                a.getUpdatedDate()
        );

        return dto;
    }

    // =========================================================
    // ROLE VALIDATION
    // =========================================================

    private void validateRole(
            String role
    ) {

        if (
                !role.equalsIgnoreCase("HOD")
                        &&
                        !role.equalsIgnoreCase("Teacher")
                        &&
                        !role.equalsIgnoreCase("SchoolAdmin")
        ) {

            throw new RuntimeException(
                    "Invalid role"
            );
        }
    }
}