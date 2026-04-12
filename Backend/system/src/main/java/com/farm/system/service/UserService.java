package com.farm.system.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.farm.system.model.User;
import com.farm.system.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // ✅ REGISTER
    public User register(User user) {
        return repo.save(user);
    }

    // ✅ LOGIN (no password)
    public User login(String name, String role) {
        return repo.findAll().stream()
                .filter(u -> u.getName().equals(name) && u.getRole().equals(role))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ GET ALL
    public List<User> getAll() {
        return repo.findAll();
    }
}