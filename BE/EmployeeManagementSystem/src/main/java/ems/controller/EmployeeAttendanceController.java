package ems.controller;

import ems.entity.Attendance;
import ems.entity.Employee;
import ems.repository.EmployeeRepository;
import ems.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class EmployeeAttendanceController {

    private final AttendanceService attendanceService;
    private final EmployeeRepository employeeRepository;

    public EmployeeAttendanceController(AttendanceService attendanceService,
                                        EmployeeRepository employeeRepository) {
        this.attendanceService = attendanceService;
        this.employeeRepository = employeeRepository;
    }

    // ------------------- Get logged-in employee attendance -------------------
    @GetMapping("/me")
    public ResponseEntity<List<Attendance>> getMyAttendance(Authentication auth) {
        // Get employee by email from JWT
        Employee emp = employeeRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Attendance> attendanceList = attendanceService.getEmployeeAttendance(emp.getId());
        return ResponseEntity.ok(attendanceList);
    }

    // ------------------- HR marks attendance for employee -------------------
    @PostMapping("/mark")
    public ResponseEntity<Attendance> markAttendance(
            @RequestParam Long empId,
            @RequestParam Boolean present
    ) {
        Attendance attendance = attendanceService.markAttendance(empId, present);
        return ResponseEntity.ok(attendance);
    }
}
