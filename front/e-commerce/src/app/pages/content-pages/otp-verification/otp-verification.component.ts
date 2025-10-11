import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'app/shared/services/cookie.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {
  email: string = '';
  otp: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  otpDigits: string[] = ['', '', '', '', '', ''];
  resendDisabled: boolean = true;
  resendCountdown: number = 60;
  private countdownInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // Get email from cookies (set during registration or login)
    this.email = this.cookieService.get('pending_verification_email') || '';
    
    if (!this.email) {
      this.router.navigate(['/pages/login']);
      return;
    }

    this.startResendCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startResendCountdown(): void {
    this.resendDisabled = true;
    this.resendCountdown = 60;
    
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.resendDisabled = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  onOtpDigitInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    this.otpDigits[index] = value;

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = input.parentElement.nextElementSibling?.querySelector('input');
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value) {
      const allFilled = this.otpDigits.every(digit => digit !== '');
      if (allFilled) {
        this.verifyOtp();
      }
    }
  }

  onOtpDigitKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = input.parentElement?.previousElementSibling?.querySelector('input');
      if (prevInput) {
        prevInput.focus();
        this.otpDigits[index - 1] = '';
      }
    }
  }

  onOtpDigitPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    
    if (pastedData && /^\d{6}$/.test(pastedData)) {
      this.otpDigits = pastedData.split('');
      
      // Focus last input
      const inputs = document.querySelectorAll('.otp-input');
      (inputs[5] as HTMLElement)?.focus();
      
      // Auto-verify
      this.verifyOtp();
    }
  }

  verifyOtp(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    const otpCode = this.otpDigits.join('');
    
    if (otpCode.length !== 6) {
      this.errorMessage = 'Please enter all 6 digits';
      return;
    }

    this.spinner.show(undefined, {
      type: 'ball-triangle-path',
      size: 'medium',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fullScreen: true
    });

    this.authService.verifyOTP(this.email, otpCode).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.successMessage = 'Email verified successfully! Redirecting to dashboard...';
        
        // Update isVerified in cookies
        this.cookieService.set('is_verified', 'true', {
          expires: 7,
          path: '/',
          secure: false,
          sameSite: 'Lax'
        });
        
        // Clear pending verification email cookie
        this.cookieService.delete('pending_verification_email');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard/dashboard1']);
        }, 2000);
      },
      error: (error) => {
        this.spinner.hide();
        this.errorMessage = error?.error?.message || 'Invalid or expired OTP. Please try again.';
        // Clear OTP inputs
        this.otpDigits = ['', '', '', '', '', ''];
        const firstInput = document.querySelector('.otp-input') as HTMLElement;
        firstInput?.focus();
      }
    });
  }

  resendOtp(): void {
    if (this.resendDisabled) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    
    this.spinner.show(undefined, {
      type: 'ball-triangle-path',
      size: 'medium',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fullScreen: true
    });

    // Call resend OTP endpoint
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.successMessage = 'OTP resent successfully! Check your email.';
        this.startResendCountdown();
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        this.spinner.hide();
        this.errorMessage = 'Failed to resend OTP. Please try again.';
      }
    });
  }

  cancelVerification(): void {
    this.cookieService.delete('pending_verification_email');
    this.router.navigate(['/pages/login']);
  }
}
