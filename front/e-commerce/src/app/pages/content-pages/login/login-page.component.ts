import { Component, ViewChild } from '@angular/core';
import { NgForm, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {
  
  loginFormSubmitted = false;
  isLoginFailed = false;
  errorMessage = '';
  showPassword = false;

  loginForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new UntypedFormControl(true)
  });

  constructor(
    private router: Router, 
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  get lf() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    
    if (this.loginForm.invalid) {
      console.log('❌ Form is invalid');
      return;
    }

    console.log('='.repeat(50));
    console.log('🚀 LOGIN ATTEMPT STARTED');
    console.log('📧 Email:', this.loginForm.value.email);
    console.log('='.repeat(50));

    this.spinner.show(undefined, {
      type: 'ball-triangle-path',
      size: 'medium',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fullScreen: true
    });

    // Use the Observable directly instead of Promise
    this.authService.login(
      this.loginForm.value.email, 
      this.loginForm.value.password
    ).subscribe({
      next: (response) => {
        console.log('='.repeat(50));
        console.log('✅ LOGIN SUCCESS IN COMPONENT');
        console.log('Response:', response);
        console.log('isVerified:', response?.isVerified);
        console.log('='.repeat(50));
        
        this.spinner.hide();
        this.isLoginFailed = false;
        
        // AuthService already handles navigation
        console.log('✅ Login complete - AuthService handled navigation');
      },
      error: (error) => {
        console.log('='.repeat(50));
        console.log('❌ LOGIN FAILED IN COMPONENT');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        console.log('='.repeat(50));
        
        this.isLoginFailed = true;
        this.errorMessage = error?.message || 'Login failed! Please check your credentials.';
        this.spinner.hide();
      }
    });
  }
}
