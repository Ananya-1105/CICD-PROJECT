package ems.service;

import ems.entity.Attendance;
import ems.entity.Employee;
import ems.repository.AttendanceRepository;
import ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    public Attendance markAttendance(Long empId, Boolean present) {
        Employee emp = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Attendance attendance = new Attendance(emp, LocalDate.now(), present);
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getEmployeeAttendance(Long empId) {
        Employee emp = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return attendanceRepository.findByEmployee(emp);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
    
    public List<Employee> getEmployeesPendingAttendance() {
        List<Employee> allEmployees = employeeRepository.findAll();
        LocalDate today = LocalDate.now();

        return allEmployees.stream()
                .filter(emp -> attendanceRepository.findByEmployeeAndDate(emp, today).isEmpty())
                .collect(Collectors.toList());
    }
}
