package com.example.fixmycity.controller;

import com.example.fixmycity.dto.request.IssueRequest;
import com.example.fixmycity.dto.response.IssueResponse;
import com.example.fixmycity.security.CustomUserDetails;
import com.example.fixmycity.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CITIZEN')")
    @ResponseStatus(HttpStatus.CREATED)
    public IssueResponse create(
            @Valid @ModelAttribute IssueRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return issueService.createIssue(request, image, principal.getUser());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN')")
    public List<IssueResponse> myIssues(@AuthenticationPrincipal CustomUserDetails principal) {
        return issueService.getMyIssues(principal.getId());
    }
}
