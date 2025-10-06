package ems.service;

import ems.dto.HrRequest; // Import the new DTO
import ems.entity.Hr;
import ems.entity.Role;
import ems.entity.User;
import ems.repository.HrRepository;
import ems.repository.RoleRepository;
import ems.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrService {

    private final HrRepository hrRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public HrService(HrRepository hrRepository, UserRepository userRepository,
                     RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.hrRepository = hrRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Use the DTO for the create method
    public Hr createHr(HrRequest hrRequest) {
        if (hrRepository.existsByUser_Username(hrRequest.getEmail())) {
            throw new RuntimeException("HR already exists with email: " + hrRequest.getEmail());
        }

        // Create User first
        User user = new User();
        user.setUsername(hrRequest.getEmail());
        user.setPassword(passwordEncoder.encode(hrRequest.getPassword()));

        Role role = roleRepository.findByName("HR")
                .orElseGet(() -> roleRepository.save(new Role(null, "HR")));
        user.getRoles().add(role);

        userRepository.save(user);

        // Save HR, linking it to the newly created user
        Hr hr = new Hr();
        hr.setName(hrRequest.getName());
        hr.setUser(user); // Link the Hr to the User
        
        return hrRepository.save(hr);
    }

    public List<Hr> getAllHrs() {
        return hrRepository.findAll();
    }

    public Optional<Hr> getHrById(Long id) {
        return hrRepository.findById(id);
    }

    // Use the DTO for the update method
    public Hr updateHr(Long id, HrRequest hrDetails) {
        Hr hr = hrRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HR not found with id: " + id));

        // Update the name on the Hr entity
        hr.setName(hrDetails.getName());

        // Update the email and password on the associated User entity
        User user = hr.getUser();
        user.setUsername(hrDetails.getEmail());
        user.setPassword(passwordEncoder.encode(hrDetails.getPassword()));
        userRepository.save(user); // Save the updated User

        return hrRepository.save(hr);
    }

    public void deleteHr(Long id) {
        hrRepository.deleteById(id);
    }
}