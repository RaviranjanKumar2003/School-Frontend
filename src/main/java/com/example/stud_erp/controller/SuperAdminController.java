package com.example.stud_erp.controller;

import com.example.stud_erp.entity.SuperAdmin;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.service.SuperAdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin")
public class SuperAdminController {

    private final SuperAdminService service;

    public SuperAdminController(SuperAdminService service) {
        this.service = service;
    }

    @PostMapping
    public SuperAdmin create(@RequestBody SuperAdmin admin) {
        return service.create(admin);
    }

    @PutMapping("/{id}")
    public SuperAdmin update(@PathVariable Long id, @RequestBody SuperAdmin admin) {
        return service.update(id, admin);
    }

    @GetMapping("/{id}")
    public SuperAdmin get(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<SuperAdmin> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted";
    }

    @PostMapping("/login")
    public SuperAdmin login(@RequestBody LoginRequest request) {

        return service.login(
                request.getUsername(),
                request.getPassword()
        );
    }
}