package com.example.stud_erp.repository;

import com.example.stud_erp.entity.FeeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeItemRepository extends JpaRepository<FeeItem, Long> {

    List<FeeItem> findByStudentFee_Id(Long studentFeeId);

}