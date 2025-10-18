package ems.service;

import ems.entity.Applicant;
import ems.entity.ApplicationStatus;
import ems.repository.ApplicantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicantService {

    private final ApplicantRepository repository;

    public ApplicantService(ApplicantRepository repository) {
        this.repository = repository;
    }

    // Save new applicant
    public Applicant save(Applicant applicant) {
        if (applicant.getStatus() == null) {
            applicant.setStatus(ApplicationStatus.REVIEWED); // default
        }
        return repository.save(applicant);
    }

    // Get all applicants
    public List<Applicant> getAllApplicants() {
        return repository.findAll();
    }

    // ✅ Update applicant status using enum
    public Applicant updateStatus(Long id, String statusStr) {
        Applicant applicant = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Applicant not found with id: " + id));

        try {
            ApplicationStatus newStatus = ApplicationStatus.valueOf(statusStr.trim().toUpperCase());
            applicant.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid status: " + statusStr + ". Must be one of: APPROVED, ON_HOLD, REJECTED, REVIEWED"
            );
        }

        return repository.save(applicant);
    }
}
