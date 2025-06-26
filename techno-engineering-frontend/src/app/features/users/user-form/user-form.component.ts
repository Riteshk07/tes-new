import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FloatingInputComponent } from '../../../shared/components/floating-input/floating-input.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatingInputComponent,
    PasswordInputComponent,
    ButtonComponent,
    CheckboxComponent
  ],
  template: `
    <div class="user-form-container">
      <div class="header">
        <h1>{{isEditMode ? 'Edit User' : 'Create User'}}</h1>
        <app-button 
          variant="outline" 
          icon="arrow-back" 
          (click)="goBack()">
          Back to Users
        </app-button>
      </div>

      <div class="form-card">
        <div class="card-header">
          <h2>{{isEditMode ? 'Edit User Details' : 'User Information'}}</h2>
          <p class="card-subtitle">
            {{isEditMode ? 'Update the user information below' : 'Enter the details for the new user'}}
          </p>
        </div>
        
        <div class="card-content">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-section">
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

              <div class="permissions-section" *ngIf="!isEditMode">
                <h3>User Permissions</h3>
                <p class="permissions-description">
                  Select the permissions this user should have in the system
                </p>
                <div class="permissions-grid">
                  <div class="permission-category">
                    <h4>User Management</h4>
                    <app-checkbox 
                      formControlName="readUsers"
                      label="View Users">
                    </app-checkbox>
                    <app-checkbox 
                      formControlName="writeUsers"
                      label="Manage Users">
                    </app-checkbox>
                  </div>
                  
                  <div class="permission-category">
                    <h4>Product Management</h4>
                    <app-checkbox 
                      formControlName="readProducts"
                      label="View Products">
                    </app-checkbox>
                    <app-checkbox 
                      formControlName="writeProducts"
                      label="Manage Products">
                    </app-checkbox>
                  </div>
                  
                  <div class="permission-category">
                    <h4>Customer Management</h4>
                    <app-checkbox 
                      formControlName="readCustomers"
                      label="View Customers">
                    </app-checkbox>
                    <app-checkbox 
                      formControlName="writeCustomers"
                      label="Manage Customers">
                    </app-checkbox>
                  </div>
                </div>
              </div>

              <div class="password-section" *ngIf="!isEditMode">
                <h3>Account Security</h3>
                <p class="password-description">
                  Set a secure password for the user account
                </p>
                
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
              </div>
            </div>

            <div class="form-actions">
              <app-button 
                variant="outline" 
                type="button" 
                (click)="goBack()">
                Cancel
              </app-button>
              <app-button 
                variant="primary" 
                type="submit" 
                [disabled]="userForm.invalid || isLoading"
                [loading]="isLoading"
                [icon]="isEditMode ? 'save' : 'plus'">
                {{isEditMode ? 'Update User' : 'Create User'}}
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-form-container {
      padding: 24px;
      max-width: 800px;
      font-family: Arial, sans-serif;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: #2653a6;
      font-size: 28px;
      font-weight: 600;
    }

    .form-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .card-header {
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #f3f4f6;
      margin-bottom: 24px;
    }

    .card-header h2 {
      margin: 0 0 8px 0;
      color: #1f2937;
      font-weight: 600;
      font-size: 20px;
    }

    .card-subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
      padding-bottom: 16px;
    }

    .card-content {
      padding: 0 24px 24px 24px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row > * {
      flex: 1;
    }

    .permissions-section {
      margin: 32px 0;
      padding: 24px;
      background-color: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .permissions-section h3 {
      margin: 0 0 8px 0;
      color: #2653a6;
      font-size: 18px;
      font-weight: 600;
    }

    .permissions-description {
      margin: 0 0 24px 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.5;
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .permission-category {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .permission-category h4 {
      margin: 0 0 16px 0;
      color: #1f2937;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 2px solid #2653a6;
      padding-bottom: 8px;
    }

    .permission-category app-checkbox {
      display: block;
      margin-bottom: 12px;
    }

    .permission-category app-checkbox:last-child {
      margin-bottom: 0;
    }

    .password-section {
      margin: 32px 0;
      padding: 24px;
      background-color: #fefce8;
      border-radius: 12px;
      border: 1px solid #facc15;
    }

    .password-section h3 {
      margin: 0 0 8px 0;
      color: #ea3b26;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .password-section h3::before {
      content: '🔒';
      font-size: 16px;
    }

    .password-description {
      margin: 0 0 20px 0;
      color: #92400e;
      font-size: 14px;
      line-height: 1.5;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 768px) {
      .user-form-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .form-row {
        flex-direction: column;
        gap: 20px;
      }

      .permissions-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column-reverse;
        gap: 12px;
      }

      .card-header,
      .card-content {
        padding: 16px;
      }

      .card-header {
        margin-bottom: 16px;
      }
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      readUsers: [false],
      writeUsers: [false],
      readProducts: [false],
      writeProducts: [false],
      readCustomers: [false],
      writeCustomers: [false],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUser();
        this.removePasswordValidators();
      } else {
        this.addPasswordValidators();
      }
    });
  }

  private addPasswordValidators() {
    const passwordControl = this.userForm.get('password');
    const confirmPasswordControl = this.userForm.get('confirmPassword');
    
    passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
    confirmPasswordControl?.setValidators([Validators.required]);
    
    this.userForm.setValidators(this.passwordMatchValidator);
    
    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

  private removePasswordValidators() {
    const passwordControl = this.userForm.get('password');
    const confirmPasswordControl = this.userForm.get('confirmPassword');
    
    passwordControl?.clearValidators();
    confirmPasswordControl?.clearValidators();
    
    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

   passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    // Cast to FormGroup since we know this validator is used at form level
    const form = control as FormGroup;
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUser() {
    // Load user data for editing
    // This would typically come from a service
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      contactNumber: '+1234567890'
    };
    
    this.userForm.patchValue(mockUser);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        const message = this.isEditMode ? 'User updated successfully!' : 'User created successfully!';
        console.log(message);
        this.router.navigate(['/users']);
      }, 2000);
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
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
    if (this.userForm.hasError('passwordMismatch') && 
        this.userForm.get('confirmPassword')?.touched) {
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