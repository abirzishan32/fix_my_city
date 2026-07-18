package com.example.fixmycity.entity;


// JPA imports
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder; // Lombok imports like @Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor, and @Builder are used to reduce boilerplate code in Java classes. They automatically generate getters, setters, constructors, and builder methods for the class fields.
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;


@Entity // This tells Hibernate that this java class represents a database table
@Table(name = "users") // Specifies the name of the database table that this entity maps to
@Getter // Generates getter methods for all fields in the class
@Setter // Generates setter methods for all fields in the class
@NoArgsConstructor // Generates a no-argument constructor for the class
@AllArgsConstructor // Generates an all-arguments constructor for the class
@Builder // Allows cleaner object creation.
public class User {

    @Id // Specifies the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PostGreSQL will automatically generate a unique value for this field when a new record is inserted into the database
    private Long id;

    // Specifies that the name column cannot be null in the database
    @Column(nullable = false)
    private String name;

    // Specifies that the email column cannot be null and must be unique in the database
    @Column(nullable = false, unique = true)
    private String email;

    // Specifies that the password column cannot be null in the database
    @Column(nullable = false)
    private String password;

    // Specifies that the phone column has a maximum length of 30 characters in the database
    @Column(length = 30)
    private String phone;

    // Specifies that the role column cannot be null and will be stored as a string in the database
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role; // Role is an enum that defines the possible roles a user can have, such as CITIZEN or ADMIN.
                        // Role enum is created in entity/Role.java file. It is used to define the role of a user in the application.

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        // Set default role to CITIZEN if not specified
        if (role == null) {
            role = Role.CITIZEN;
        }
    }
}
