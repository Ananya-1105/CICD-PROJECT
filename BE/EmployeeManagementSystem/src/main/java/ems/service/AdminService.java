package ems.service;

import ems.entity.Admin;
import ems.entity.User;
import ems.repository.AdminRepository;
import ems.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public AdminService(AdminRepository adminRepository, UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates an Admin and links it to an existing User.
     * The User should be created by the AuthService first.
     * Note: This method should be called *after* a User is created.
     */
    public Admin createAdmin(Admin admin, User user) {
        // Here, we only check for a duplicate Admin based on their linked user.
        if (adminRepository.existsByUser_Username(user.getUsername())) { 
            throw new RuntimeException("Admin already exists for this user.");
        }
        
        // Link the existing user to the new Admin entity
        admin.setUser(user);
        
        // Save the Admin entity without handling the password
        return adminRepository.save(admin);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    /**
     * Updates an Admin's details, but does not handle email or password changes.
     * These should be handled by the UserService/AuthService.
     */
    public Admin updateAdmin(Long id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));

        // 🔹 Corrected: Only update the 'name' field, as 'email' is on the User entity.
        admin.setName(adminDetails.getName());

        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}
