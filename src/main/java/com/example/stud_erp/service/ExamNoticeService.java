package com.example.stud_erp.service;

import com.example.stud_erp.entity.*;
import com.example.stud_erp.payload.ExamNoticeDTO;
import com.example.stud_erp.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamNoticeService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private ExamNoticeRepository noticeRepo;

    @Autowired
    private ClassRepository classRepo;


    public void createExamNotice(Long classId, String examType, String message) {

        List<Subject> subjects =
                subjectRepository.findByClassEntityId(classId);

        for (Subject sub : subjects) {

            String subjectName = sub.getSubjectName().trim();

            List<Professor> teachers = professorRepository.findAll()
                    .stream()
                    .filter(p ->
                            p.getSubject() != null &&
                                    p.getSubject().trim().toLowerCase()
                                            .equals(subjectName.trim().toLowerCase())
                    )
                    .toList();

            System.out.println("👉 Subject from DB: " + subjectName);

            for (Professor p : professorRepository.findAll()) {
                System.out.println("👉 Teacher Subject: " + p.getSubject());
            }

            for (Professor teacher : teachers) {

                ExamNotice notice = new ExamNotice();

                notice.setClassId(classId);
                notice.setExamType(examType);
                notice.setSubjectName(subjectName);
                notice.setTeacherId(teacher.getId());

                // ✅ ADMIN MESSAGE USE
                notice.setMessage(message);

                notice.setStatus("CREATED");

                noticeRepo.save(notice);
            }
        }
    }

    // 🔥 teacher ke liye
    public List<ExamNoticeDTO> getTeacherNotices(Long teacherId) {

        List<ExamNotice> list = noticeRepo.findByTeacherId(teacherId);

        return list.stream().map(n -> {

            ExamNoticeDTO dto = new ExamNoticeDTO();

            dto.setId(n.getId());
            dto.setSubjectName(n.getSubjectName());
            dto.setExamType(n.getExamType());
            dto.setMessage(n.getMessage());
            dto.setCreatedAt(n.getCreatedAt().toString());

            // 🔥 CLASS NAME
            dto.setClassName("Unknown");

            if (n.getClassId() != null) {
                classRepo.findById(n.getClassId())
                        .ifPresent(c -> dto.setClassName(c.getClassName()));
            }

            return dto;

        }).toList();
    }

    public List<ExamNoticeDTO> getAll() {

        List<ExamNotice> list = noticeRepo.findAll();

        return list.stream().map(n -> {

            ExamNoticeDTO dto = new ExamNoticeDTO();

            dto.setId(n.getId());
            dto.setExamType(n.getExamType());
            dto.setSubjectName(n.getSubjectName());
            dto.setMessage(n.getMessage());
            dto.setStatus(n.getStatus());
            dto.setCreatedAt(n.getCreatedAt().toString());

            // 🔥 CLASS NAME
            dto.setClassName("Unknown");

            if (n.getClassId() != null) {
                classRepo.findById(n.getClassId())
                        .ifPresent(c -> dto.setClassName(c.getClassName()));
            }

            return dto;

        }).toList();
    }

    public void delete(Long id) {
        noticeRepo.deleteById(id);
    }

    public void updateExamNotice(List<Long> ids, String message) {

        List<ExamNotice> notices = noticeRepo.findAllById(ids);

        for (ExamNotice n : notices) {
            n.setMessage(message);
        }

        noticeRepo.saveAll(notices);
    }
}