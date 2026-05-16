package com.example.stud_erp.payload;

import java.util.List;

public class ProfessorDTO {

    private Long id;

    private String name;
    private String email;
    private String phone;

    private String designation;
    private String qualification;
    private String experience;
    private String joiningDate;

    private String username;
    private String password;

    private Long schoolId;
    private Long schoolAdminId;

    private List<AssignmentDTO> assignments;

    private Boolean updateAssignments;

// CONSTRUCTOR

    public static class AssignmentDTO {
        private String className;
        private Long classId;
        private String subjectName;

        public Long getClassId() { return classId; }
        public void setClassId(Long classId) { this.classId = classId; }

        public String getClassName() { return className; }
        public void setClassName(String className) { this.className = className; }

        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    }



    // GETTERS SETTERS


    public Boolean getUpdateAssignments() {
        return updateAssignments;
    }

    public void setUpdateAssignments(Boolean updateAssignments) {
        this.updateAssignments = updateAssignments;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getJoiningDate() { return joiningDate; }
    public void setJoiningDate(String joiningDate) { this.joiningDate = joiningDate; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Long getSchoolId() { return schoolId; }
    public void setSchoolId(Long schoolId) { this.schoolId = schoolId; }

    public Long getSchoolAdminId() {
        return schoolAdminId;
    }

    public void setSchoolAdminId(Long schoolAdminId) {
        this.schoolAdminId = schoolAdminId;
    }

    public List<AssignmentDTO> getAssignments() { return assignments; }
    public void setAssignments(List<AssignmentDTO> assignments) { this.assignments = assignments; }
}