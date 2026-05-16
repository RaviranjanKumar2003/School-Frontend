package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.SuperAdmin;
import com.example.stud_erp.repository.SuperAdminRepository;
import com.example.stud_erp.service.SuperAdminService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SuperAdminServiceImpl implements SuperAdminService {

    private final SuperAdminRepository repo;

    public SuperAdminServiceImpl(SuperAdminRepository repo) {
        this.repo = repo;
    }

    @Override
    public SuperAdmin create(SuperAdmin admin) {
        return repo.save(admin);
    }

    @Override
    public SuperAdmin update(Long id, SuperAdmin admin) {

        SuperAdmin existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Super Admin not found"));

        existing.setName(admin.getName());
        existing.setUsername(admin.getUsername());
        existing.setPassword(admin.getPassword());
        existing.setEmail(admin.getEmail());
        existing.setPhone(admin.getPhone());

        return repo.save(existing);
    }

    @Override
    public SuperAdmin getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    @Override
    public List<SuperAdmin> getAll() {
        return repo.findAll();
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public SuperAdmin login(String username, String password) {

        SuperAdmin admin = repo.findByUsername(username);

        if (admin == null || !admin.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return admin;
    }
}