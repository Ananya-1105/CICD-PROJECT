package ems.controller;

import ems.dto.EmployeeDTO;
import ems.dto.HrRequest;
import ems.entity.*;
import ems.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hrs")
public class HrController {

    private final HrService hrService;
    private final EmployeeService employeeService;
    private final LeaveService leaveService;
    private final AttendanceService attendanceService;

    public HrController(HrService hrService,
                        EmployeeService employeeService,
                        LeaveService leaveService,
                        AttendanceService attendanceService) {
        this.hrService = hrService;
        this.employeeService = employeeService;
        this.leaveService = leaveService;
        this.attendanceService = attendanceService;
    }

    // ------------------- HR CRUD -------------------
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

    @PutMapping("/{id}")
    public ResponseEntity<Hr> updateHr(@PathVariable Long id, @RequestBody HrRequest hrDetails) {
        return ResponseEntity.ok(hrService.updateHr(id, hrDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHr(@PathVariable Long id) {
        hrService.deleteHr(id);
        return ResponseEntity.noContent().build();
    }

    // ------------------- Employee List -------------------
    @GetMapping("/employees")
    public List<EmployeeDTO> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // ------------------- Leave Management -------------------
    @GetMapping("/leaves")
    public List<LeaveRequest> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @PutMapping("/leaves/{id}/status")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(
            @PathVariable Long id, @RequestParam LeaveStatus status) {
        return ResponseEntity.ok(leaveService.updateLeaveStatus(id, status));
    }

    // ------------------- Attendance -------------------
    @PostMapping("/attendance/{empId}")
    public ResponseEntity<Attendance> markAttendance(
            @PathVariable Long empId, @RequestParam Boolean present) {
        return ResponseEntity.ok(attendanceService.markAttendance(empId, present));
    }

    @GetMapping("/attendance")
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/attendance/{empId}")
    public List<Attendance> getEmployeeAttendance(@PathVariable Long empId) {
        return attendanceService.getEmployeeAttendance(empId);
    }
    @GetMapping("/employees/pending-attendance")
    public List<EmployeeDTO> getEmployeesPendingAttendance() {
        List<Employee> pending = attendanceService.getEmployeesPendingAttendance();
        return pending.stream().map(EmployeeDTO::fromEntity).collect(Collectors.toList());
    }
}
