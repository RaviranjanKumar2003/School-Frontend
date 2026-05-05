package com.example.stud_erp.controller;

import com.example.stud_erp.payload.FeeItemDTO;
import com.example.stud_erp.service.FeeItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee-items")
@CrossOrigin("*")
public class FeeItemController {

    @Autowired
    private FeeItemService feeItemService;

    // 🔥 ADD ITEM
    @PostMapping("/add/{studentFeeId}")
    public FeeItemDTO addItem(
            @PathVariable Long studentFeeId,
            @RequestBody FeeItemDTO dto
    ) {
        return feeItemService.addItem(studentFeeId, dto);
    }

    // 🔥 GET ITEMS BY FEE
    @GetMapping("/fee/{studentFeeId}")
    public List<FeeItemDTO> getItemsByFee(@PathVariable Long studentFeeId) {
        return feeItemService.getItemsByFee(studentFeeId);
    }

    // 🔥 UPDATE ITEM
    @PutMapping("/update/{id}")
    public FeeItemDTO updateItem(
            @PathVariable Long id,
            @RequestBody FeeItemDTO dto
    ) {
        return feeItemService.updateItem(id, dto);
    }

    // 🔥 DELETE ITEM
    @DeleteMapping("/delete/{id}")
    public String deleteItem(@PathVariable Long id) {
        feeItemService.deleteItem(id);
        return "Item deleted successfully";
    }
}