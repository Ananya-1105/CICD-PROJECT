package ems.controller;

import ems.dto.HrRequest; // Import the DTO
import ems.entity.Hr;
import ems.service.HrService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hrs")
public class HrController {

    private final HrService hrService;

    public HrController(HrService hrService) {
        this.hrService = hrService;
    }

    // Add a new method to handle creation
    @PostMapping
    public ResponseEntity<Hr> createHr(@RequestBody HrRequest hrRequest) {
        Hr createdHr = hrService.createHr(hrRequest);
        return new ResponseEntity<>(createdHr, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Hr> getAllHrs() {
        return hrService.getAllHrs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hr> getHrById(@PathVariable Long id) {
        return hrService.getHrById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update to use the DTO
    @PutMapping("/{id}")
    public ResponseEntity<Hr> updateHr(@PathVariable Long id, @RequestBody HrRequest hrDetails) {
        return ResponseEntity.ok(hrService.updateHr(id, hrDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHr(@PathVariable Long id) {
        hrService.deleteHr(id);
        return ResponseEntity.noContent().build();
    }
}