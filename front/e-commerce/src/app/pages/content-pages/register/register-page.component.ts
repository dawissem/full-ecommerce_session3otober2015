import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm, UntypedFormGroup, FormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { SignUpRequest } from 'app/shared/auth/auth.models';
import { NgxSpinnerService } from 'ngx-spinner';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../../../shared/directives/must-match.validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: [AuthService]
})

export class RegisterPageComponent implements OnInit {
  registerFormSubmitted = false;
  registerForm: UntypedFormGroup;
  isRegistrationFailed = false;
  errorMessage = '';

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get rf() {
    return this.registerForm.controls;
  }

  //  On submit click, register user
  onSubmit() {
    this.registerFormSubmitted = true;
    this.isRegistrationFailed = false;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.spinner.show(undefined, {
      type: 'ball-triangle-path',
      size: 'medium',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fullScreen: true
    });

    // Split full name into firstName and lastName
    const fullName = this.registerForm.value.name.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const signupRequest: SignUpRequest = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      firstName: firstName,
      lastName: lastName
    };

    this.authService.register(signupRequest).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.isRegistrationFailed = false;
        
        // Show success message and redirect to login
        alert('Registration successful! Please login with your credentials.');
        
        // Redirect to login page
        this.router.navigate(['/pages/login']);
      },
      error: (error) => {
        this.spinner.hide();
        this.isRegistrationFailed = true;
        this.errorMessage = error.message || 'Registration failed! Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}
