package ems.controller;

import ems.dto.AuthResponse;
import ems.dto.LoginRequest;
import ems.dto.RegisterRequest;
import ems.entity.User;
import ems.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 🔹 Register new user (Admin, HR, or Employee)
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        try {
            User newUser = authService.register(request);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 🔹 Login with JWT
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        if (response == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(response);
    }
}
