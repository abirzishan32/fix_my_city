package com.example.fixmycity.dto.response;

import com.example.fixmycity.entity.Issue;

import java.time.Instant;

public record IssueResponse(
        Long id,
        String title,
        String description,
        String category,
        String severity,
        String status,
        Double latitude,
        Double longitude,
        String address,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt,
        Long citizenId,
        String citizenName
) {

    public static IssueResponse from(Issue issue) {
        return new IssueResponse(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getCategory() != null ? issue.getCategory().name() : null,
                issue.getSeverity() != null ? issue.getSeverity().name() : null,
                issue.getStatus() != null ? issue.getStatus().name() : null,
                issue.getLatitude(),
                issue.getLongitude(),
                issue.getAddress(),
                issue.getImageUrl(),
                issue.getCreatedAt(),
                issue.getUpdatedAt(),
                issue.getCitizen() != null ? issue.getCitizen().getId() : null,
                issue.getCitizen() != null ? issue.getCitizen().getName() : null
        );
    }
}
