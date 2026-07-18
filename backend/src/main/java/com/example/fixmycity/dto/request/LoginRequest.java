package com.example.fixmycity.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Record class to represent the login request payload containing email and password fields.
public record LoginRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "A valid email is required")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}
