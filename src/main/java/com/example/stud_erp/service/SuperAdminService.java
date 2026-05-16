package com.example.stud_erp.service;

import com.example.stud_erp.entity.SuperAdmin;
import java.util.List;

public interface SuperAdminService {

    SuperAdmin create(SuperAdmin admin);

    SuperAdmin update(Long id, SuperAdmin admin);

    SuperAdmin getById(Long id);

    List<SuperAdmin> getAll();

    void delete(Long id);

    SuperAdmin login(String username, String password);
}