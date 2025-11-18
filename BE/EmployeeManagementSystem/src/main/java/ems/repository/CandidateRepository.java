package ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ems.entity.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {}
