package com.example.fixmycity.service;

import com.example.fixmycity.dto.request.IssueRequest;
import com.example.fixmycity.dto.response.IssueResponse;
import com.example.fixmycity.dto.response.StatisticsResponse;
import com.example.fixmycity.entity.Category;
import com.example.fixmycity.entity.Issue;
import com.example.fixmycity.entity.IssueStatus;
import com.example.fixmycity.entity.Severity;
import com.example.fixmycity.entity.User;
import com.example.fixmycity.exception.ResourceNotFoundException;
import com.example.fixmycity.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final SupabaseStorageService storageService;

    /**
     * Image upload (a network call) happens before persistence so we don't hold a
     * DB connection open for the duration of the upload.
     */
    public IssueResponse createIssue(IssueRequest request, MultipartFile image, User citizen) {
        String imageUrl = storageService.upload(image);
        Issue issue = Issue.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .severity(request.getSeverity())
                .status(IssueStatus.SUBMITTED)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .imageUrl(imageUrl)
                .citizen(citizen)
                .build();
        return IssueResponse.from(issueRepository.save(issue));
    }

    @Transactional
    public IssueResponse updateStatus(Long id, IssueStatus status) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id " + id));
        issue.setStatus(status);
        return IssueResponse.from(issueRepository.save(issue));
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getMyIssues(Long citizenId) {
        return issueRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
                .stream()
                .map(IssueResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(IssueResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public StatisticsResponse getStatistics() {
        long total = issueRepository.count();

        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (IssueStatus status : IssueStatus.values()) {
            byStatus.put(status.name(), issueRepository.countByStatus(status));
        }

        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (Category category : Category.values()) {
            byCategory.put(category.name(), issueRepository.countByCategory(category));
        }

        Map<String, Long> bySeverity = new LinkedHashMap<>();
        for (Severity severity : Severity.values()) {
            bySeverity.put(severity.name(), issueRepository.countBySeverity(severity));
        }

        return new StatisticsResponse(total, byStatus, byCategory, bySeverity);
    }
}
