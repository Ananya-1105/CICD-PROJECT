package ems.controller;

import ems.entity.User;
import ems.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/admin")
    public ResponseEntity<User> createAdmin(@RequestParam String username, @RequestParam String password) {
        return ResponseEntity.ok(userService.createAdmin(username, password));
    }

    @PostMapping("/hr")
    public ResponseEntity<User> createHR(@RequestParam String username, @RequestParam String password) {
        return ResponseEntity.ok(userService.createHR(username, password));
    }

    @PostMapping("/employee")
    public ResponseEntity<User> createEmployee(@RequestParam String username, @RequestParam String password) {
        return ResponseEntity.ok(userService.createEmployeeUser(username, password));
    }
}
