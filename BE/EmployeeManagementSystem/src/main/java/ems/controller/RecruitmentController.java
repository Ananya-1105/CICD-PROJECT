package ems.controller;

import ems.entity.Applicant;
import ems.entity.ApplicationStatus;
import ems.service.ApplicantService;
import ems.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hrs/recruitments")
public class RecruitmentController {

    private final ApplicantService applicantService;
    private final EmailService emailService;

    public RecruitmentController(ApplicantService applicantService, EmailService emailService) {
        this.applicantService = applicantService;
        this.emailService = emailService;
    }

    // DTO for status update
    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    // Get all applicants
    @GetMapping
    public List<Applicant> getAllApplicants() {
        return applicantService.getAllApplicants();
    }

    // Update applicant status safely and send email
    @PutMapping("/{id}/status")
    public Applicant updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        String statusStr = request.getStatus();

        if (statusStr == null || statusStr.isBlank()) {
            throw new IllegalArgumentException("Status must not be empty");
        }

        // Convert string to enum safely
        ApplicationStatus status;
        try {
            status = ApplicationStatus.valueOf(statusStr.replace("\"", "").trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status. Allowed values: APPROVED, ON_HOLD, REJECTED, REVIEWED");
        }

        // Update status in service
        Applicant updatedApplicant = applicantService.updateStatus(id, status.name());

        // Send email notification
        String subject = "Application Status Update";
        String text = "Hello " + updatedApplicant.getFirstName() + ",\n\n" +
                      "Your application status has been updated to: " + status.name();
        emailService.sendEmail(updatedApplicant.getEmail(), subject, text);

        return updatedApplicant;
    }
}
