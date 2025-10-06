package ems.repository;

import ems.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Corrected to check for the user's username (email)
    boolean existsByUser_Username(String username);
}
