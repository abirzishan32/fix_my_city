package com.example.fixmycity.dto.request;

import com.example.fixmycity.entity.IssueStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(

        @NotNull(message = "Status is required")
        IssueStatus status
) {
}
