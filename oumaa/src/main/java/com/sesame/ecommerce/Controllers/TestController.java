package com.sesame.ecommerce.Controllers;

import com.sesame.ecommerce.Models.DTO.request.response.JwtAuthenticationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/check-response")
    public ResponseEntity<JwtAuthenticationResponse> testResponse() {
        JwtAuthenticationResponse response = JwtAuthenticationResponse.builder()
                .accessToken("test-token")
                .refreshToken("test-refresh")
                .userId(1L)
                .role("USER")
                .tokenType("Bearer")
                .isVerified(false)  // Test if this field appears in response
                .build();
        
        System.out.println("🧪 Test response created with isVerified: " + response.isVerified());
        return ResponseEntity.ok(response);
    }
}
