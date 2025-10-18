package ems.repository;

import ems.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    // Optional: find by email
    Applicant findByEmail(String email);
}
