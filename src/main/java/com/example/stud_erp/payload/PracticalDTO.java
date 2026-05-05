package com.example.stud_erp.payload;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PracticalDTO {

    @NotNull
    private Long id;
    @NotNull
    private String name;
    @NotNull
    private String grade;
    @NotNull
    private int written;
    @NotNull
    private int viva;
    @NotNull
    private Long semesterId;


    public PracticalDTO(Long id, String name, String grade, int written, int viva, Long semesterId) {
        this.id = id;
        this.name = name;
        this.grade = grade;
        this.written = written;
        this.viva = viva;
        this.semesterId = semesterId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public int getWritten() {
        return written;
    }

    public void setWritten(int written) {
        this.written = written;
    }

    public int getViva() {
        return viva;
    }

    public void setViva(int viva) {
        this.viva = viva;
    }

    public Long getSemesterId() {
        return semesterId;
    }

    public void setSemesterId(Long semesterId) {
        this.semesterId = semesterId;
    }
}