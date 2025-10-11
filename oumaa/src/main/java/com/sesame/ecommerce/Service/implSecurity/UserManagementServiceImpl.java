package com.sesame.ecommerce.Service.implSecurity;

import com.sesame.ecommerce.Models.DTO.request.UpdateUserRequest;
import com.sesame.ecommerce.Models.DTO.request.response.UserDTO;
import com.sesame.ecommerce.Models.User;
import com.sesame.ecommerce.Repositories.UserRepository;
import com.sesame.ecommerce.Security.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository userRepository;

    @Override
    public List<UserDTO> getAllUsers() {
        System.out.println("📋 Fetching all users");
        List<User> users = userRepository.findAll();
        System.out.println("✅ Found " + users.size() + " users");
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<UserDTO> getAllUsersPaginated(Pageable pageable) {
        System.out.println("📋 Fetching users paginated - Page: " + pageable.getPageNumber() + ", Size: " + pageable.getPageSize());
        Page<User> users = userRepository.findAll(pageable);
        System.out.println("✅ Found " + users.getTotalElements() + " total users, returning page " + users.getNumber());
        return users.map(this::convertToDTO);
    }

    @Override
    public UserDTO getUserById(Long id) {
        System.out.println("🔍 Fetching user with ID: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        System.out.println("✅ User found: " + user.getEmail());
        return convertToDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        System.out.println("✏️ Updating user with ID: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update fields if they are not null
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getIsVerified() != null) {
            user.setIsVerified(request.getIsVerified());
        }
        if (request.getIsEnabled() != null) {
            user.setIsEnabled(request.getIsEnabled());
        }

        // Update fullName
        if (user.getFirstName() != null && user.getLastName() != null) {
            user.setFullName(user.getFirstName() + " " + user.getLastName());
        }

        User updatedUser = userRepository.save(user);
        System.out.println("✅ User updated successfully: " + updatedUser.getEmail());
        return convertToDTO(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        System.out.println("🗑️ Deleting user with ID: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
        System.out.println("✅ User deleted: " + user.getEmail());
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long id) {
        System.out.println("🔄 Toggling status for user ID: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setIsEnabled(!user.getIsEnabled());
        userRepository.save(user);
        System.out.println("✅ User status toggled. New status: " + (user.getIsEnabled() ? "Enabled" : "Disabled"));
    }

    @Override
    public long getTotalUsers() {
        return userRepository.count();
    }

    @Override
    public long getVerifiedUsers() {
        return userRepository.countByIsVerified(true);
    }

    @Override
    public long getUnverifiedUsers() {
        return userRepository.countByIsVerified(false);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .isVerified(user.getIsVerified())  // Now uses proper getter
                .isEnabled(user.getIsEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
