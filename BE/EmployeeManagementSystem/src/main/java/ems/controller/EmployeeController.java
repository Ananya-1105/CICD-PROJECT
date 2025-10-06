package ems.controller;

import ems.dto.EmployeeDTO;
import ems.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Get all employees
    @GetMapping
    public List<EmployeeDTO> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // Get employee by ID
    @GetMapping("/{id}")
    public EmployeeDTO getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    // Add new employee
    @PostMapping
    public EmployeeDTO addEmployee(@RequestBody EmployeeDTO dto) {
        return employeeService.createEmployee(dto);
    }

    // Update employee
    @PutMapping("/{id}")
    public EmployeeDTO updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
        return employeeService.updateEmployee(id, dto);
    }

    // Delete employee
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
    }
 // Get recent hires (last 5 employees by hireDate)
    @GetMapping("/recent")
    public List<EmployeeDTO> getRecentHires() {
        return employeeService.getRecentHires();
    }
 // ---------------- Analytics Endpoints ----------------

 // Employee count by department (for pie chart)
 @GetMapping("/stats/department-count")
 public Map<String, Long> getEmployeeCountByDepartment() {
     return employeeService.getEmployeeCountByDepartment();
 }

 // Employee count by position (for pie chart)
 @GetMapping("/stats/position-count")
 public Map<String, Long> getEmployeeCountByPosition() {
     return employeeService.getEmployeeCountByPosition();
 }

 // Average salary by department (for bar chart)
 @GetMapping("/stats/avg-salary-department")
 public Map<String, Double> getAverageSalaryByDepartment() {
     return employeeService.getAverageSalaryByDepartment();
 }

 // Average salary by position (for bar chart)
 @GetMapping("/stats/avg-salary-position")
 public Map<String, Double> getAverageSalaryByPosition() {
     return employeeService.getAverageSalaryByPosition();
 }


}
