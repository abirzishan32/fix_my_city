package com.example.fixmycity.dto.response;

import java.util.Map;

/**
 * Aggregated counts for the admin dashboard charts.
 * Maps are keyed by enum name (e.g. "SUBMITTED" -> 12).
 */
public record StatisticsResponse(
        long totalIssues,
        Map<String, Long> byStatus,
        Map<String, Long> byCategory,
        Map<String, Long> bySeverity
) {
}
