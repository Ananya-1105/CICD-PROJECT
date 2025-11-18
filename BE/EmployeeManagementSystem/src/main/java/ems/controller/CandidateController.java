
package ems.controller;

import ems.entity.Candidate;
import ems.repository.CandidateRepository;
import ems.service.MailSenderService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/api/candidates")
@CrossOrigin
public class CandidateController {

    private final CandidateRepository repo;
    private final MailSenderService mailSenderService;

    public CandidateController(CandidateRepository repo, MailSenderService mailSenderService) {
        this.repo = repo;
        this.mailSenderService = mailSenderService;
    }

    @GetMapping
    public List<Candidate> getAll() {
        return repo.findAll();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Candidate c = repo.findById(id).orElseThrow();
        c.setStatus(status);
        repo.save(c);

        mailSenderService.sendDecisionEmail(c.getEmail(), status);

        return ResponseEntity.ok("Candidate " + status);
    }
    @DeleteMapping("/clear")
    public String clearAllCandidates() {
        repo.deleteAll();
        return "All candidates deleted successfully!";
    }

}
