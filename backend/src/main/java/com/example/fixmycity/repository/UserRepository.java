package com.example.fixmycity.repository;

import com.example.fixmycity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


// Create a repository for User entities where the primary key type is Long
/*
Syntax: JpaRepository<EntityType, IDType>
Here:
EntityType = User
IDType     = Long
*/


// We do not need to write the SQL query or the implementation code yourself.
// Spring reads this method name: find + By + Email and understands:
// Find a User entity where the email column equals the given email value.
// How Spring understands this is by parsing the method name and mapping it to the corresponding SQL query based on the entity's field names and types.
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email); // This method will allow us to find a user by their email address.
                                                // Instead of returning User, it returns an Optional<User> which is a container object which may or may not contain a non-null value.

    boolean existsByEmail(String email);  // Checks if a user with the given email exists in the database. Returns true if a user with the given email exists, false otherwise.
}
