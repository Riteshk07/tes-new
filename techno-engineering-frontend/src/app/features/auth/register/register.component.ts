import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FloatingInputComponent } from '../../../shared/components/floating-input/floating-input.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FloatingInputComponent,
    PasswordInputComponent,
    ButtonComponent
  ],
  template: `
    <div class="register-container">
      <div class="register-background">
        <div class="background-pattern"></div>
      </div>
      
      <div class="register-content">
        <div class="brand-header">
          <div class="brand-logo">
            <svg class="logo-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
          </div>
          <h1 class="brand-title">Join Techno Engineering</h1>
          <p class="brand-subtitle">Create your account to get started</p>
        </div>

        <div class="register-card">
          <div class="register-header">
            <h1 class="register-title">Create Account</h1>
            <p class="register-subtitle">Fill in your details to register</p>
          </div>
          
          <div class="register-form-content">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <app-floating-input
                  label="First Name"
                  [required]="true"
                  formControlName="firstName"
                  width="100%"
                  [error]="getFieldError('firstName')">
                </app-floating-input>

                <app-floating-input
                  label="Last Name"
                  [required]="true"
                  formControlName="lastName"
                  width="100%"
                  [error]="getFieldError('lastName')">
                </app-floating-input>
              </div>

              <app-floating-input
                label="Email Address"
                type="email"
                [required]="true"
                formControlName="email"
                width="100%"
                [error]="getFieldError('email')">
              </app-floating-input>

              <app-floating-input
                label="Contact Number"
                type="tel"
                [required]="true"
                formControlName="contactNumber"
                width="100%"
                [error]="getFieldError('contactNumber')">
              </app-floating-input>

              <app-password-input
                label="Password"
                [required]="true"
                formControlName="password"
                width="100%"
                [error]="getFieldError('password')">
              </app-password-input>

              <app-password-input
                label="Confirm Password"
                [required]="true"
                formControlName="confirmPassword"
                width="100%"
                [error]="getFieldError('confirmPassword') || getPasswordMismatchError()">
              </app-password-input>

              <div class="form-actions">
                <app-button
                  variant="primary"
                  type="submit"
                  [disabled]="registerForm.invalid || isLoading"
                  [loading]="isLoading"
                  class="register-button">
                  Create Account
                </app-button>
              </div>
            </form>
          </div>
          
          <div class="register-actions">
            <p class="login-link">
              Already have an account? 
              <a routerLink="/login" class="login-button">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }

    .register-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #2653a6 0%, #4285f4 50%, #ea3b26 100%);
      z-index: 1;
    }

    .background-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(1deg); }
    }

    .register-content {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 520px;
      padding: 20px;
    }

    .brand-header {
      text-align: center;
      margin-bottom: 40px;
      color: white;
    }

    .brand-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .logo-icon {
      color: white;
    }

    .brand-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      font-family: Arial, sans-serif;
    }

    .brand-subtitle {
      font-size: 16px;
      margin: 0;
      opacity: 0.9;
      font-weight: 400;
    }

    .register-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .register-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    }

    .register-header {
      text-align: center;
      padding: 32px 32px 16px 32px;
      background: linear-gradient(135deg, rgba(38, 83, 166, 0.05) 0%, rgba(75, 73, 76, 0.05) 100%);
    }

    .register-title {
      font-size: 26px;
      font-weight: 600;
      margin: 0;
      color: #2653a6;
      font-family: Arial, sans-serif;
    }

    .register-subtitle {
      font-size: 14px;
      color: #4b494c;
      margin: 8px 0 0 0;
      opacity: 0.8;
    }

    .register-form-content {
      padding: 24px 32px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-row > * {
      flex: 1;
    }

    .form-actions {
      margin-top: 32px;
    }

    .register-button {
      width: 100%;
    }

    .register-actions {
      padding: 16px 32px 32px 32px;
      text-align: center;
      background: rgba(248, 249, 250, 0.5);
    }

    .login-link {
      margin: 0;
      color: #4b494c;
      font-size: 14px;
    }

    .login-button {
      color: #2653a6;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .login-button:hover {
      color: #ea3b26;
      text-decoration: underline;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .register-container {
        padding: 16px;
      }

      .brand-title {
        font-size: 24px;
      }

      .brand-subtitle {
        font-size: 14px;
      }

      .register-card {
        border-radius: 16px;
      }

      .register-header,
      .register-form-content,
      .register-actions {
        padding-left: 24px;
        padding-right: 24px;
      }

      .register-title {
        font-size: 22px;
      }

      .form-row {
        flex-direction: column;
        gap: 20px;
      }
    }

    @media (max-width: 480px) {
      .brand-logo {
        width: 60px;
        height: 60px;
        margin-bottom: 16px;
      }

      .logo-icon {
        width: 30px;
        height: 30px;
      }

      .brand-title {
        font-size: 20px;
      }

      .register-header,
      .register-form-content,
      .register-actions {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      // Simulate registration (replace with actual service call)
      setTimeout(() => {
        this.isLoading = false;
        console.log('Registration successful! Please login.');
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.hasError('required')) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.hasError('email')) {
        return 'Please enter a valid email address';
      }
      if (field.hasError('minlength')) {
        const requiredLength = field.getError('minlength').requiredLength;
        return `Password must be at least ${requiredLength} characters long`;
      }
    }
    return '';
  }

  getPasswordMismatchError(): string {
    if (this.registerForm.hasError('passwordMismatch') && 
        this.registerForm.get('confirmPassword')?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      contactNumber: 'Contact number',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    return displayNames[fieldName] || fieldName;
  }
}