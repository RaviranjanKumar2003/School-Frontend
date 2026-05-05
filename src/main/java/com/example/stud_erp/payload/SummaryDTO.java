package com.example.stud_erp.payload;

public class SummaryDTO {

    private Long totalStudents;
    private Long paidStudents;
    private Long pendingStudents;
    private Double totalFeeAmount;

    private double totalCollectionAmount;
    private double totalPendingAmount;

    // GETTERS & SETTERS


    public Double getTotalFeeAmount() {
        return totalFeeAmount;
    }

    public void setTotalFeeAmount(Double totalFeeAmount) {
        this.totalFeeAmount = totalFeeAmount;
    }

    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Long getPaidStudents() {
        return paidStudents;
    }

    public void setPaidStudents(Long paidStudents) {
        this.paidStudents = paidStudents;
    }

    public Long getPendingStudents() {
        return pendingStudents;
    }

    public void setPendingStudents(Long pendingStudents) {
        this.pendingStudents = pendingStudents;
    }

    public double getTotalCollectionAmount() {
        return totalCollectionAmount;
    }

    public void setTotalCollectionAmount(double totalCollectionAmount) {
        this.totalCollectionAmount = totalCollectionAmount;
    }

    public double getTotalPendingAmount() {
        return totalPendingAmount;
    }

    public void setTotalPendingAmount(double totalPendingAmount) {
        this.totalPendingAmount = totalPendingAmount;
    }
}