package ems.repository;

import ems.entity.Hr;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HrRepository extends JpaRepository<Hr, Long> {
	 boolean existsByUser_Username(String username);
}
