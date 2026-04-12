package com.farm.system.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.farm.system.model.User;
import com.farm.system.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User register(@RequestBody User u) {
        return userService.register(u);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.login(
                user.getName(),
                user.getRole()
        );
    }

    @GetMapping
    public List<User> get() {
        return userService.getAll();
    }
}