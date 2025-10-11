package com.sesame.ecommerce.Models.DTO.request;

import com.sesame.ecommerce.Models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private Boolean isVerified;
    private Boolean isEnabled;
}
