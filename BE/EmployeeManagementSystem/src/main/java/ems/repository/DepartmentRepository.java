package ems.repository;

import ems.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    // Find department by name (optional convenience method)
    Optional<Department> findByName(String name);

    // Check if a department exists by name
    boolean existsByName(String name);
}
