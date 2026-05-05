package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.FeeItem;
import com.example.stud_erp.entity.StudentFee;
import com.example.stud_erp.payload.FeeItemDTO;
import com.example.stud_erp.repository.FeeItemRepository;
import com.example.stud_erp.repository.StudentFeeRepository;
import com.example.stud_erp.service.FeeItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeeItemServiceImpl implements FeeItemService {

    @Autowired
    private FeeItemRepository feeItemRepo;

    @Autowired
    private StudentFeeRepository studentFeeRepo;

    // 🔥 ADD ITEM
    @Override
    public FeeItemDTO addItem(Long studentFeeId, FeeItemDTO dto) {

        StudentFee fee = studentFeeRepo.findById(studentFeeId)
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        FeeItem item = new FeeItem();
        item.setTitle(dto.getTitle());
        item.setDescription(dto.getDescription());
        item.setAmount(dto.getAmount());
        item.setStudentFee(fee);

        FeeItem saved = feeItemRepo.save(item);

        return mapToDTO(saved);
    }

    // 🔥 GET ALL ITEMS
    @Override
    public List<FeeItemDTO> getItemsByFee(Long studentFeeId) {

        return feeItemRepo.findByStudentFee_Id(studentFeeId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // 🔥 UPDATE
    @Override
    public FeeItemDTO updateItem(Long id, FeeItemDTO dto) {

        FeeItem item = feeItemRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setTitle(dto.getTitle());
        item.setDescription(dto.getDescription());
        item.setAmount(dto.getAmount());

        return mapToDTO(feeItemRepo.save(item));
    }

    // 🔥 DELETE
    @Override
    public void deleteItem(Long id) {
        feeItemRepo.deleteById(id);
    }

    // 🔁 MAPPER
    private FeeItemDTO mapToDTO(FeeItem item) {
        FeeItemDTO dto = new FeeItemDTO();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setAmount(item.getAmount());
        return dto;
    }
}