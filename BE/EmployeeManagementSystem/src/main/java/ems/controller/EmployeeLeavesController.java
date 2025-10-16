package ems.controller;

import ems.entity.Attendance;
import ems.entity.Employee;
import ems.entity.LeaveRequest;
import ems.entity.LeaveStatus;
import ems.repository.EmployeeRepository;
import ems.service.AttendanceService;
import ems.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class EmployeeLeavesController {

    private final LeaveService leaveService;
    private final EmployeeRepository employeeRepository;

    public EmployeeLeavesController(LeaveService leaveService, EmployeeRepository employeeRepository) {
        this.leaveService = leaveService;
        this.employeeRepository = employeeRepository;
    }

    // ------------------- Submit leave -------------------
    @PostMapping
    public ResponseEntity<LeaveRequest> submitLeave(@RequestBody LeaveRequest leaveRequest, Authentication auth) {
        // Find employee by username/email from JWT
        Employee emp = employeeRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        leaveRequest.setEmployee(emp);
        leaveRequest.setStatus(LeaveStatus.PENDING);

        LeaveRequest savedLeave = leaveService.applyLeave(emp.getId(), leaveRequest);
        return ResponseEntity.ok(savedLeave);
    }

    // ------------------- Get all leaves for logged-in employee -------------------
    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getMyLeaves(Authentication auth) {
        Employee emp = employeeRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<LeaveRequest> leaves = leaveService.getLeavesByEmployee(emp.getId());
        return ResponseEntity.ok(leaves);
    }
    
  
}
