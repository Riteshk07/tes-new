import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatingInputComponent } from '../floating-input/floating-input.component';
import { SearchInputComponent } from '../search-input/search-input.component';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, FloatingInputComponent, SearchInputComponent],
  template: `
    <div class="demo-container">
      <h2>Modern Input Components Demo</h2>
      
      <div class="demo-section">
        <h3>Floating Label Inputs</h3>
        <div class="demo-row">
          <app-floating-input
            label="Full Name"
            [required]="true"
            [(ngModel)]="fullName"
            width="300px">
          </app-floating-input>
          
          <app-floating-input
            label="Email Address"
            type="email"
            [(ngModel)]="email"
            width="300px">
          </app-floating-input>
        </div>
        
        <div class="demo-row">
          <app-floating-input
            label="Password"
            type="password"
            [(ngModel)]="password"
            width="300px">
          </app-floating-input>
          
          <app-floating-input
            label="Disabled Field"
            [disabled]="true"
            value="This is disabled"
            width="300px">
          </app-floating-input>
        </div>
        
        <div class="demo-row">
          <app-floating-input
            label="Field with Error"
            [(ngModel)]="errorField"
            error="This field has an error"
            width="300px">
          </app-floating-input>
        </div>
      </div>
      
      <div class="demo-section">
        <h3>Search Inputs</h3>
        <div class="demo-row">
          <app-search-input
            placeholder="Search products..."
            [(ngModel)]="searchQuery"
            width="320px"
            (search)="onSearch($event)">
          </app-search-input>
          
          <app-search-input
            placeholder="Search with loading..."
            [(ngModel)]="searchQuery2"
            width="320px"
            [loading]="isSearching"
            (search)="onSearchWithLoading($event)">
          </app-search-input>
        </div>
        
        <div class="demo-row">
          <app-search-input
            placeholder="Disabled search"
            [disabled]="true"
            width="320px">
          </app-search-input>
          
          <app-search-input
            placeholder="No clear button"
            [(ngModel)]="searchQuery3"
            [clearButton]="false"
            width="320px">
          </app-search-input>
        </div>
      </div>
      
      <div class="demo-output">
        <h3>Values</h3>
        <pre>{{ getValues() | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      min-height: 100vh;
    }
    
    .demo-section {
      margin-bottom: 40px;
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .demo-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .demo-output {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      color: #2653a6;
      margin-bottom: 30px;
      text-align: center;
    }
    
    h3 {
      color: #4b494c;
      margin-bottom: 20px;
      font-size: 18px;
    }
    
    pre {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e9ecef;
      overflow-x: auto;
    }
    
    @media (max-width: 768px) {
      .demo-row {
        flex-direction: column;
      }
    }
  `]
})
export class InputDemoComponent {
  fullName = '';
  email = '';
  password = '';
  errorField = '';
  searchQuery = '';
  searchQuery2 = '';
  searchQuery3 = '';
  isSearching = false;

  onSearch(query: string) {
    console.log('Search query:', query);
  }

  onSearchWithLoading(query: string) {
    this.isSearching = true;
    console.log('Search with loading:', query);
    
    // Simulate API call
    setTimeout(() => {
      this.isSearching = false;
    }, 2000);
  }

  getValues() {
    return {
      fullName: this.fullName,
      email: this.email,
      password: this.password ? '***hidden***' : '',
      errorField: this.errorField,
      searchQuery: this.searchQuery,
      searchQuery2: this.searchQuery2,
      searchQuery3: this.searchQuery3
    };
  }
}