package ems.service;

import ems.dto.AuthResponse;
import ems.dto.LoginRequest;
import ems.dto.RegisterRequest;
import ems.entity.*;
import ems.repository.*;
import ems.utils.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;
    private final HrRepository hrRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            AdminRepository adminRepository,
            HrRepository hrRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.adminRepository = adminRepository;
        this.hrRepository = hrRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Register a new user with a role and also insert into role-specific table.
     */
    public User register(RegisterRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String roleName = request.getRole();

        if (email == null || password == null) {
            throw new RuntimeException("Email and password are required");
        }

        if (userRepository.existsByUsername(email)) {
            throw new RuntimeException("User already exists with username: " + email);
        }

        if (roleName == null || roleName.trim().isEmpty()) {
            roleName = "EMPLOYEE";
        }

        final String finalRoleName = roleName.trim().toUpperCase();

        Role role = roleRepository.findByName(finalRoleName)
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName(finalRoleName);
                    return roleRepository.save(r);
                });

        // Create User
        User user = new User();
        user.setUsername(email); // Use email as the username
        user.setPassword(passwordEncoder.encode(password));
        user.getRoles().add(role);

        User savedUser = userRepository.save(user);

        // Insert into role-specific tables
        switch (finalRoleName) {
            case "ADMIN":
                Admin admin = new Admin();
                admin.setName(request.getName());
                admin.setUser(savedUser);
                adminRepository.save(admin);
                break;

            case "HR":
                Hr hr = new Hr();
                hr.setName(request.getName());
                hr.setUser(savedUser);
                hrRepository.save(hr);
                break;

            case "EMPLOYEE":
                Employee emp = new Employee();
                emp.setFirstName(request.getFirstName());
                emp.setLastName(request.getLastName());
                emp.setEmail(request.getEmail());
                emp.setUserAccount(savedUser);

                // 🔹 New code to populate additional fields using LocalDate
                try {
                    if (request.getHireDate() != null) {
                        emp.setHireDate(LocalDate.parse(request.getHireDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                    }
                } catch (DateTimeParseException e) {
                    throw new RuntimeException("Invalid date format. Use YYYY-MM-DD.", e);
                }
                emp.setPhone(request.getPhone());
                emp.setPosition(request.getPosition());
                emp.setSalary(request.getSalary());
                
                // You'll need to handle the Department entity relationship
                if (request.getDepartmentId() != null) {
                    // This assumes you have a DepartmentRepository to find the department by ID
                    // Optional<Department> department = departmentRepository.findById(request.getDepartmentId());
                    // department.ifPresent(emp::setDepartment);
                }

                employeeRepository.save(emp);
                break;

            default:
                throw new RuntimeException("Unsupported role: " + finalRoleName);
        }

        return savedUser;
    }

    /**
     * Authenticate user credentials, check hashed password, and generate a JWT.
     */
    public AuthResponse login(LoginRequest request) {
        Optional<User> uOpt = userRepository.findByUsername(request.getUsername());
        if (!uOpt.isPresent()) {
            return null;
        }
        User user = uOpt.get();

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return null;
        }

        // Generate JWT
        Set<Role> roles = user.getRoles();
        String token = jwtUtil.generateToken(user.getUsername(), roles);

        return new AuthResponse(
                token,
                user.getUsername(),
                roles.stream().map(Role::getName).collect(Collectors.toList())
        );
    }
}
