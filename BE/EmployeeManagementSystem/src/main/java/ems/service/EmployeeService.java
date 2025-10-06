package ems.service;

import ems.dto.EmployeeDTO;
import ems.entity.Department;
import ems.entity.Employee;
import ems.entity.Role;
import ems.entity.User;
import ems.repository.DepartmentRepository;
import ems.repository.EmployeeRepository;
import ems.repository.RoleRepository;
import ems.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ---------------- CREATE ----------------
    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        Employee employee = new Employee();
        mapToEntity(dto, employee);

        // ✅ Create associated User
        User user = new User();
        user.setUsername(dto.getEmail());
        user.setPassword(passwordEncoder.encode("default123")); // or dto.getPassword()

        Role role = roleRepository.findByName("EMPLOYEE")
                .orElseGet(() -> roleRepository.save(new Role(null, "EMPLOYEE")));
        user.getRoles().add(role);

        User savedUser = userRepository.save(user);
        employee.setUserAccount(savedUser);

        Employee saved = employeeRepository.save(employee);
        return mapToDTO(saved);
    }

    // ---------------- UPDATE ----------------
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        mapToEntity(dto, employee);
        Employee saved = employeeRepository.save(employee);
        return mapToDTO(saved);
    }

    // ---------------- DELETE ----------------
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employeeRepository.delete(employee);
    }

    // ---------------- GET ALL ----------------
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ---------------- GET ONE ----------------
    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return mapToDTO(employee);
    }

    // ---------------- STATS ----------------
    public Map<String, Long> getEmployeeCountByDepartment() {
        return employeeRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned",
                        Collectors.counting()
                ));
    }

    // ---------------- MAPPERS ----------------
    private void mapToEntity(EmployeeDTO dto, Employee employee) {
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setPosition(dto.getPosition());
        employee.setSalary(dto.getSalary());
        employee.setHireDate(dto.getHireDate());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            employee.setDepartment(dept);
        } else {
            employee.setDepartment(null);
        }
    }

    private EmployeeDTO mapToDTO(Employee emp) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(emp.getId());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setEmail(emp.getUserAccount() != null ? emp.getUserAccount().getUsername() : emp.getEmail());
        dto.setPhone(emp.getPhone());
        dto.setPosition(emp.getPosition());
        dto.setSalary(emp.getSalary());
        dto.setHireDate(emp.getHireDate());

        if (emp.getDepartment() != null) {
            dto.setDepartmentId(emp.getDepartment().getId());
            dto.setDepartmentName(emp.getDepartment().getName()); // ✅ added
        } else {
            dto.setDepartmentId(null);
            dto.setDepartmentName("Unassigned"); // ✅ avoid undefined in frontend
        }

        return dto;
    }
 // ---------------- RECENT HIRES ----------------
    public List<EmployeeDTO> getRecentHires() {
        return employeeRepository.findAll().stream()
                .sorted((a, b) -> b.getHireDate().compareTo(a.getHireDate())) // newest first
                .limit(5)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
 // ---------------- Employee Count by Position ----------------
    public Map<String, Long> getEmployeeCountByPosition() {
        return employeeRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        e -> e.getPosition() != null ? e.getPosition() : "Unassigned",
                        Collectors.counting()
                ));
    }

    // ---------------- Average Salary by Department ----------------
    public Map<String, Double> getAverageSalaryByDepartment() {
        return employeeRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned",
                        Collectors.averagingDouble(e -> e.getSalary() != null ? e.getSalary() : 0.0)
                ));
    }

    // ---------------- Average Salary by Position ----------------
    public Map<String, Double> getAverageSalaryByPosition() {
        return employeeRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        e -> e.getPosition() != null ? e.getPosition() : "Unassigned",
                        Collectors.averagingDouble(e -> e.getSalary() != null ? e.getSalary() : 0.0)
                ));
    }


}
