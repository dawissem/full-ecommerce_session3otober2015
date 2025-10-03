package com.sesame.ecommerce.Models.DTO.request.response;

import com.sesame.ecommerce.Models.Role;

public record DtoUser(
        Long id ,
        String fullName,
        String email,
        Role role
) {


}
