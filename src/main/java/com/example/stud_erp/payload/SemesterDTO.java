package com.example.stud_erp.payload;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Data
public class SemesterDTO {

    private Long id;
    private String semester;
    private CourseDTO course;
    private StudentDTO student;
    private List<PracticalDTO> practicals;
    private List<SubjectSessionDTO> subjects;

    public SemesterDTO(Long id, String semester, CourseDTO courseDTO) {
    }

    public SemesterDTO(Long id, String semester, CourseDTO courseDTO, StudentDTO studentDTO) {
        this.id = id;
        this.semester = semester;
        this.course = courseDTO;
        this.student = studentDTO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public StudentDTO getStudent() {
        return student;
    }

    public void setStudent(StudentDTO student) {
        this.student = student;
    }

    public List<PracticalDTO> getPracticals() {
        return practicals;
    }

    public void setPracticals(List<PracticalDTO> practicals) {
        this.practicals = practicals;
    }

    public List<SubjectSessionDTO> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectSessionDTO> subjects) {
        this.subjects = subjects;
    }
}