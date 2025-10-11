package com.sesame.ecommerce.Service.implSecurity;

import com.sesame.ecommerce.Exception.OTPExpiredException;
import com.sesame.ecommerce.Exception.TokenRefreshException;
import com.sesame.ecommerce.Models.DTO.request.RefreshTokenRequest;
import com.sesame.ecommerce.Models.DTO.request.ResetPasswordRequest;
import com.sesame.ecommerce.Models.DTO.request.SignUpRequest;
import com.sesame.ecommerce.Models.DTO.request.SigninRequest;
import com.sesame.ecommerce.Models.DTO.request.response.JwtAuthenticationResponse;
import com.sesame.ecommerce.Models.RefreshToken;
import com.sesame.ecommerce.Models.Role;
import com.sesame.ecommerce.Models.User;
import com.sesame.ecommerce.Repositories.UserRepository;
import com.sesame.ecommerce.Security.AuthenticationService;
import com.sesame.ecommerce.Security.EmailService;
import com.sesame.ecommerce.Security.JwtService;
import com.sesame.ecommerce.Security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationServicelmpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    @Override
    public JwtAuthenticationResponse SignUp(SignUpRequest request) {
        Role role = request.getRole() != null ? request.getRole() : Role.CUSTOMER;
        
        // Generate OTP for email verification
        String otp = generateOTP();
        
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isVerified(false)  // Set to false on signup
                .otp(otp)
                .otpExpiry(LocalDateTime.now().plusMinutes(10))  // OTP valid for 10 minutes
                .build();
        
        userRepository.save(user);
        
        // Send OTP email
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
            System.out.println("✅ OTP email sent to: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP email: " + e.getMessage());
        }
        
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return JwtAuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .role(user.getRole().name())
                .tokenType("Bearer")
                .isVerified(user.getIsVerified())  // Include verification status
                .build();
    }

    @Override
    public JwtAuthenticationResponse SignIn(SigninRequest request) {
        System.out.println("🔑 Authenticating user: " + request.getEmail());
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        System.out.println("✅ User found: " + user.getEmail());
        System.out.println("🔍 User verification status: " + user.getIsVerified());
        
        // If user is not verified, send OTP email
        if (!user.getIsVerified()) {
            System.out.println("⚠️ User not verified - generating new OTP");
            String otp = generateOTP();
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);
            
            try {
                emailService.sendOtpEmail(user.getEmail(), otp);
                System.out.println("✅ OTP email sent to: " + user.getEmail());
            } catch (Exception e) {
                System.err.println("❌ Failed to send OTP email: " + e.getMessage());
            }
        }
        
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user.getId());

        System.out.println("🎯 Building response with isVerified: " + user.getIsVerified());
        
        return JwtAuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .role(user.getRole().name())
                .tokenType("Bearer")
                .isVerified(user.getIsVerified())  // CRITICAL: Include verification status
                .build();
    }

    @Override
    public JwtAuthenticationResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user);
                    return JwtAuthenticationResponse.builder()
                            .accessToken(token)
                            .refreshToken(requestRefreshToken)
                            .userId(user.getId())
                            .role(user.getRole().name())
                            .tokenType("Bearer")
                            .build();
                })
                .orElseThrow(() -> new TokenRefreshException(
                        requestRefreshToken,
                        "Refresh token is not in database!"
                ));
    }
    public void sendForgotPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new OTPExpiredException("User with email " + email + " not found"));

        String otp = generateOTP();
        user.setOtp(otp);

        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    public void verifyOTP(String email, String otp) {
        System.out.println("🔍 Verifying OTP for email: " + email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new OTPExpiredException("User with email " + email + " not found"));

        if (!user.getOtp().equals(otp)) {
            System.out.println("❌ Invalid OTP provided");
            throw new OTPExpiredException("Invalid OTP");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            System.out.println("❌ OTP has expired");
            throw new OTPExpiredException("OTP has expired");
        }
        
        // Set user as verified
        user.setIsVerified(true);  // Fixed method name
        user.setOtp(null);  // Clear OTP
        user.setOtpExpiry(null);  // Clear expiry
        userRepository.save(user);
        
        System.out.println("✅ User verified successfully: " + email);
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new OTPExpiredException("User with email " + request.getEmail() + " not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

}