package com.example.fixmycity.repository;

import com.example.fixmycity.entity.Category;
import com.example.fixmycity.entity.Issue;
import com.example.fixmycity.entity.IssueStatus;
import com.example.fixmycity.entity.Severity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    // Find all issues reported by a specific citizen, ordered by the creation date in descending order.
    List<Issue> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    // Find all issues assigned to a specific worker, ordered by the creation date in descending order.
    List<Issue> findAllByOrderByCreatedAtDesc();

    // Count the number of issues with a specific status.
    long countByStatus(IssueStatus status);

    // Count the number of issues in a specific category.
    long countByCategory(Category category);

    // Count the number of issues with a specific severity level.
    long countBySeverity(Severity severity);
}
