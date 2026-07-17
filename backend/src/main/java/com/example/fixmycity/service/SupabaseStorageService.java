package com.example.fixmycity.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * Uploads issue images to Supabase Storage via its REST API and returns the public URL.
 * Requires a public bucket (default "issue-images") and the service_role key.
 */
@Service
public class SupabaseStorageService {

    private final String supabaseUrl;
    private final String serviceRoleKey;
    private final String bucket;
    private final RestClient restClient;

    public SupabaseStorageService(
            @Value("${app.supabase.url}") String supabaseUrl,
            @Value("${app.supabase.service-role-key}") String serviceRoleKey,
            @Value("${app.supabase.bucket}") String bucket) {
        this.supabaseUrl = stripTrailingSlash(supabaseUrl);
        this.serviceRoleKey = serviceRoleKey;
        this.bucket = bucket;
        this.restClient = RestClient.create();
    }

    /**
     * @return the public URL of the stored object, or {@code null} if no file was provided.
     */
    public String upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (serviceRoleKey == null || serviceRoleKey.isBlank()) {
            throw new IllegalStateException(
                    "Supabase Storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY and create a public '"
                            + bucket + "' bucket.");
        }

        String objectPath = "issues/" + UUID.randomUUID() + extractExtension(file.getOriginalFilename());
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + objectPath;
        String contentType = file.getContentType() != null
                ? file.getContentType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        try {
            restClient.post()
                    .uri(uploadUrl)
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apikey", serviceRoleKey)
                    .header("x-upsert", "true")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded image", e);
        }

        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + objectPath;
    }

    private static String extractExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : "";
    }

    private static String stripTrailingSlash(String value) {
        return (value != null && value.endsWith("/")) ? value.substring(0, value.length() - 1) : value;
    }
}
