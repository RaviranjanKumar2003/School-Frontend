package com.example.stud_erp.service;

import com.example.stud_erp.entity.SchoolAdmin;
import com.example.stud_erp.payload.LoginResponse;

public interface SchoolAdminService {

    SchoolAdmin create(SchoolAdmin admin);

    SchoolAdmin update(Long id, SchoolAdmin admin);

    SchoolAdmin getById(Long id);

    void delete(Long id);


    LoginResponse login(String username, String password);

    SchoolAdmin saveSchoolAdmin(SchoolAdmin admin);
}