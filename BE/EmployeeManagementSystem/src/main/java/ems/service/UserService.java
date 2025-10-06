package ems.service;

import ems.entity.Role;
import ems.entity.User;
import ems.repository.RoleRepository;
import ems.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User createUserWithRole(String username, String password, String roleName) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("User already exists with username: " + username);
        }

        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(null, roleName)));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // Password is now encoded
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public User createAdmin(String username, String password) {
        return createUserWithRole(username, password, "ADMIN");
    }

    public User createHR(String username, String password) {
        return createUserWithRole(username, password, "HR");
    }

    public User createEmployeeUser(String username, String password) {
        return createUserWithRole(username, password, "EMPLOYEE");
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
