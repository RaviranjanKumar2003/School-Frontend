package com.example.stud_erp.service;

import com.example.stud_erp.payload.FeeItemDTO;

import java.util.List;

public interface FeeItemService {

    FeeItemDTO addItem(Long studentFeeId, FeeItemDTO dto);

    List<FeeItemDTO> getItemsByFee(Long studentFeeId);

    FeeItemDTO updateItem(Long id, FeeItemDTO dto);

    void deleteItem(Long id);
}