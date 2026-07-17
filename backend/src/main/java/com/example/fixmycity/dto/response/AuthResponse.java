package com.example.fixmycity.dto.response;

/**
 * Returned on register/login. The JWT itself is delivered as an HttpOnly cookie
 * (not in the body) so it cannot be read by client-side JavaScript.
 */
public record AuthResponse(
        Long userId,
        String name,
        String email,
        String role
) {
}
