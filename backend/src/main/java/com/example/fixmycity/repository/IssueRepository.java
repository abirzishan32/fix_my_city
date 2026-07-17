package com.example.fixmycity.repository;

import com.example.fixmycity.entity.Category;
import com.example.fixmycity.entity.Issue;
import com.example.fixmycity.entity.IssueStatus;
import com.example.fixmycity.entity.Severity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    List<Issue> findAllByOrderByCreatedAtDesc();

    long countByStatus(IssueStatus status);

    long countByCategory(Category category);

    long countBySeverity(Severity severity);
}
