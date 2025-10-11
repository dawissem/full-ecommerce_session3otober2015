package com.sesame.ecommerce.Controllers;

import com.sesame.ecommerce.Models.DTO.request.UpdateUserRequest;
import com.sesame.ecommerce.Models.DTO.request.response.UserDTO;
import com.sesame.ecommerce.Security.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "https://localhost:4200"})
public class UserManagementController {

    private final UserManagementService userManagementService;

    /**
     * Get all users (simple list)
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        System.out.println("🌐 GET /api/v1/users - Fetching all users");
        List<UserDTO> users = userManagementService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get all users with pagination
     */
    @GetMapping("/paginated")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<UserDTO>> getAllUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        System.out.println("🌐 GET /api/v1/users/paginated - Page: " + page + ", Size: " + size);
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserDTO> users = userManagementService.getAllUsersPaginated(pageable);
        
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        System.out.println("🌐 GET /api/v1/users/" + id);
        UserDTO user = userManagementService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Update user
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {
        System.out.println("🌐 PUT /api/v1/users/" + id);
        UserDTO updatedUser = userManagementService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        System.out.println("🌐 DELETE /api/v1/users/" + id);
        userManagementService.deleteUser(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        response.put("userId", id.toString());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Toggle user enabled/disabled status
     */
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, String>> toggleUserStatus(@PathVariable Long id) {
        System.out.println("🌐 PATCH /api/v1/users/" + id + "/toggle-status");
        userManagementService.toggleUserStatus(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User status toggled successfully");
        response.put("userId", id.toString());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get user statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        System.out.println("🌐 GET /api/v1/users/stats");
        
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userManagementService.getTotalUsers());
        stats.put("verifiedUsers", userManagementService.getVerifiedUsers());
        stats.put("unverifiedUsers", userManagementService.getUnverifiedUsers());
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Exception handler
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
