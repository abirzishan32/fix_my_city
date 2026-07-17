package com.example.fixmycity.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookieUtil {

    private final String cookieName;
    private final boolean secure;
    private final String sameSite;
    private final long maxAgeSeconds;

    public CookieUtil(
            @Value("${app.jwt.cookie-name}") String cookieName,
            @Value("${app.jwt.cookie-secure}") boolean secure,
            @Value("${app.jwt.cookie-same-site}") String sameSite,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.cookieName = cookieName;
        this.secure = secure;
        this.sameSite = sameSite;
        this.maxAgeSeconds = expirationMs / 1000;
    }

    public ResponseCookie create(String token) {
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .build();
    }

    public ResponseCookie clear() {
        return ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(0)
                .build();
    }
}
