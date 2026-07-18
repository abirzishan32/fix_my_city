package com.example.fixmycity.dto.request;

import com.example.fixmycity.entity.Category;
import com.example.fixmycity.entity.Severity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Bound from multipart/form-data via {@code @ModelAttribute}, so it is a mutable
 * bean (setters) rather than a record. The image file is handled separately as a
 * {@code MultipartFile} request part.
 */


// If frontend sends JSON, record is enough.
// If frontend sends fields+file, we need a mutable bean with setters to bind the request data to the object.
@Getter
@Setter
public class IssueRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Severity is required")
    private Severity severity;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String address;
}
