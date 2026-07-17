package com.example.fixmycity.service;

import com.example.fixmycity.config.JwtService;
import com.example.fixmycity.dto.request.LoginRequest;
import com.example.fixmycity.dto.request.RegisterRequest;
import com.example.fixmycity.dto.response.AuthResponse;
import com.example.fixmycity.entity.Role;
import com.example.fixmycity.entity.User;
import com.example.fixmycity.exception.EmailAlreadyExistsException;
import com.example.fixmycity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    /**
     * Carries the raw JWT (for the controller to set as an HttpOnly cookie)
     * alongside the body payload.
     */
    public record AuthResult(String token, AuthResponse response) {
    }

    @Transactional
    public AuthResult register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Email already registered: " + request.email());
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .role(Role.CITIZEN)
                .build();
        return buildResult(userRepository.save(user));
    }

    public AuthResult login(LoginRequest request) {
        // Throws BadCredentialsException (-> 401) on failure.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
        return buildResult(user);
    }

    private AuthResult buildResult(User user) {
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        AuthResponse response = new AuthResponse(
                user.getId(), user.getName(), user.getEmail(), user.getRole().name());
        return new AuthResult(token, response);
    }
}
