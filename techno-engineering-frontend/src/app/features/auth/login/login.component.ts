import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FloatingInputComponent } from '../../../shared/components/floating-input/floating-input.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../../services/auth.service';
import { LoginDto } from '../../../models/user.dto';

@Component({
  selector: 'app-login',
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
    <div class="login-container">
      <div class="login-background">
        <div class="background-pattern"></div>
      </div>
      
      <div class="login-content">
        <div class="brand-header">
          <div class="brand-logo">
            <svg class="logo-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
          </div>
          <h1 class="brand-title">Techno Engineering Solution</h1>
          <p class="brand-subtitle">Product Inquiry & Quotation Management</p>
        </div>

        <div class="login-card">
          <div class="login-header">
            <h1 class="login-title">Welcome Back</h1>
            <p class="login-subtitle">Sign in to your account</p>
          </div>
          
          <div class="login-form-content">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <app-floating-input
                  label="Email Address"
                  type="email"
                  [required]="true"
                  formControlName="username"
                  width="100%"
                  [error]="getFieldError('username')">
                </app-floating-input>
              </div>

              <div class="form-group">
                <app-password-input
                  label="Password"
                  [required]="true"
                  formControlName="password"
                  width="100%"
                  [error]="getFieldError('password')">
                </app-password-input>
              </div>

              <div class="form-actions">
                <app-button
                  variant="primary"
                  type="submit"
                  [disabled]="loginForm.invalid || isLoading"
                  [loading]="isLoading"
                  class="login-button">
                  Sign In
                </app-button>
              </div>
            </form>
          </div>
          
          <div class="login-actions">
            <p class="register-link">
              Don't have an account? 
              <a routerLink="/register" class="register-button">Create Account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }

    .login-background {
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

    .login-content {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 440px;
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
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }

    .brand-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .brand-subtitle {
      font-size: 16px;
      margin: 0;
      opacity: 0.9;
      font-weight: 400;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .login-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    }

    .login-header {
      text-align: center;
      padding: 32px 32px 16px 32px;
      background: linear-gradient(135deg, rgba(38, 83, 166, 0.05) 0%, rgba(75, 73, 76, 0.05) 100%);
    }

    .login-title {
      font-size: 26px;
      font-weight: 600;
      margin: 0;
      color: #2653a6;
      font-family: Arial, sans-serif;
    }

    .login-subtitle {
      font-size: 14px;
      color: #4b494c;
      margin: 8px 0 0 0;
      opacity: 0.8;
    }

    .login-form-content {
      padding: 24px 32px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-actions {
      margin-top: 32px;
    }

    .login-button {
      width: 100%;
    }

    .login-actions {
      padding: 16px 32px 32px 32px;
      text-align: center;
      background: rgba(248, 249, 250, 0.5);
    }

    .register-link {
      margin: 0;
      color: #4b494c;
      font-size: 14px;
    }

    .register-button {
      color: #2653a6;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .register-button:hover {
      color: #ea3b26;
      text-decoration: underline;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .login-container {
        padding: 16px;
      }

      .brand-title {
        font-size: 24px;
      }

      .brand-subtitle {
        font-size: 14px;
      }

      .login-card {
        border-radius: 16px;
      }

      .login-header,
      .login-form-content,
      .login-actions {
        padding-left: 24px;
        padding-right: 24px;
      }

      .login-title {
        font-size: 22px !important;
      }
    }

    @media (max-width: 480px) {
      .brand-logo {
        width: 60px;
        height: 60px;
        margin-bottom: 16px;
      }

      .logo-icon {
        font-size: 30px;
        width: 30px;
        height: 30px;
      }

      .brand-title {
        font-size: 20px;
      }

      .login-header,
      .login-form-content,
      .login-actions {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials: LoginDto = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status) {
            console.log('Login successful!');
            this.router.navigate(['/dashboard']);
          } else {
            console.log(response.message || 'Login failed');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log('Login failed. Please check your credentials.');
          console.error('Login error:', error);
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.hasError('required')) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }
}