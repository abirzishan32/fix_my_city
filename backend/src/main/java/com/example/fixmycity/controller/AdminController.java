package com.example.fixmycity.controller;

import com.example.fixmycity.dto.request.UpdateStatusRequest;
import com.example.fixmycity.dto.response.IssueResponse;
import com.example.fixmycity.dto.response.StatisticsResponse;
import com.example.fixmycity.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final IssueService issueService;

    @GetMapping("/issues")
    public List<IssueResponse> allIssues() {
        return issueService.getAllIssues();
    }

    @GetMapping("/statistics")
    public StatisticsResponse statistics() {
        return issueService.getStatistics();
    }

    @PatchMapping("/issues/{id}/status")
    public IssueResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        return issueService.updateStatus(id, request.status());
    }
}
