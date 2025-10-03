package com.sesame.ecommerce.Security;

import com.sesame.ecommerce.Models.DTO.request.response.DtoUser;
import com.sesame.ecommerce.Models.User;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class UserMapper implements Function<User, DtoUser> {
    @Override
    public DtoUser apply(User user) {
        return new DtoUser(
                user.getId(),user.getFullName(), user.getEmail() , user.getRole()
        );
    }


}
