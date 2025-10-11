package com.sesame.ecommerce.Security;

import com.sesame.ecommerce.Models.DTO.request.UpdateUserRequest;
import com.sesame.ecommerce.Models.DTO.request.response.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserManagementService {
    List<UserDTO> getAllUsers();
    Page<UserDTO> getAllUsersPaginated(Pageable pageable);
    UserDTO getUserById(Long id);
    UserDTO updateUser(Long id, UpdateUserRequest request);
    void deleteUser(Long id);
    void toggleUserStatus(Long id);
    long getTotalUsers();
    long getVerifiedUsers();
    long getUnverifiedUsers();
}
