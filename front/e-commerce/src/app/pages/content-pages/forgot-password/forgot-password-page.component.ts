import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-forgot-password-page',
    templateUrl: './forgot-password-page.component.html',
    styleUrls: ['./forgot-password-page.component.scss']
})

export class ForgotPasswordPageComponent implements OnInit {
    step: 'email' | 'otp' | 'reset' = 'email';
    
    emailFormSubmitted = false;
    otpFormSubmitted = false;
    resetFormSubmitted = false;
    
    isEmailSent = false;
    isOtpVerified = false;
    isPasswordReset = false;
    
    errorMessage = '';
    successMessage = '';
    
    email = '';
    
    emailForm = new UntypedFormGroup({
        email: new UntypedFormControl('', [Validators.required, Validators.email])
    });
    
    otpForm = new UntypedFormGroup({
        otp: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
    });
    
    resetForm = new UntypedFormGroup({
        newPassword: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new UntypedFormControl('', [Validators.required])
    });

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        // Add custom validator for password match
        this.resetForm.setValidators(this.passwordMatchValidator.bind(this));
    }

    get ef() {
        return this.emailForm.controls;
    }
    
    get of() {
        return this.otpForm.controls;
    }
    
    get rf() {
        return this.resetForm.controls;
    }

    // Custom validator to check if passwords match
    passwordMatchValidator(form: UntypedFormGroup) {
        const newPassword = form.get('newPassword');
        const confirmPassword = form.get('confirmPassword');
        
        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    // Step 1: Send OTP to email
    onSubmitEmail() {
        this.emailFormSubmitted = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        if (this.emailForm.invalid) {
            return;
        }

        this.spinner.show();
        this.email = this.emailForm.value.email;

        this.authService.forgotPassword(this.email).subscribe({
            next: (response) => {
                this.spinner.hide();
                this.isEmailSent = true;
                this.successMessage = 'OTP sent to your email successfully!';
                this.step = 'otp';
            },
            error: (error) => {
                this.spinner.hide();
                this.errorMessage = error.message || 'Failed to send OTP. Please try again.';
            }
        });
    }

    // Step 2: Verify OTP
    onSubmitOTP() {
        this.otpFormSubmitted = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        if (this.otpForm.invalid) {
            return;
        }

        this.spinner.show();
        const otp = this.otpForm.value.otp;

        this.authService.verifyOTP(this.email, otp).subscribe({
            next: (response) => {
                this.spinner.hide();
                this.isOtpVerified = true;
                this.successMessage = 'OTP verified successfully!';
                this.step = 'reset';
            },
            error: (error) => {
                this.spinner.hide();
                this.errorMessage = error.message || 'Invalid OTP. Please try again.';
            }
        });
    }

    // Step 3: Reset Password
    onSubmitReset() {
        this.resetFormSubmitted = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        if (this.resetForm.invalid) {
            return;
        }

        this.spinner.show();

        const resetRequest = {
            email: this.email,
            otp: this.otpForm.value.otp,
            newPassword: this.resetForm.value.newPassword
        };

        this.authService.resetPassword(resetRequest).subscribe({
            next: (response) => {
                this.spinner.hide();
                this.isPasswordReset = true;
                this.successMessage = 'Password reset successfully! Redirecting to login...';
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    this.router.navigate(['/pages/login']);
                }, 2000);
            },
            error: (error) => {
                this.spinner.hide();
                this.errorMessage = error.message || 'Failed to reset password. Please try again.';
            }
        });
    }

    // Resend OTP
    onResendOTP() {
        this.onSubmitEmail();
    }

    // On login link click
    onLogin() {
        this.router.navigate(['login'], { relativeTo: this.route.parent });
    }

    // On registration link click
    onRegister() {
        this.router.navigate(['register'], { relativeTo: this.route.parent });
    }
}
