import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { ResponsiveService } from './services/responsive.service';
import { UserDto } from './models/user.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar class="app-toolbar brand-toolbar">
        <button mat-icon-button (click)="toggleSidenav()" *ngIf="currentUser$ | async">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="app-title">Techno Engineering Solution</span>
        <span class="spacer"></span>
        <div *ngIf="currentUser$ | async as user" class="user-menu">
          <button mat-icon-button (click)="toggleTheme()" matTooltip="Toggle theme">
            <mat-icon>{{isDarkTheme ? 'light_mode' : 'dark_mode'}}</mat-icon>
          </button>
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>person</mat-icon>
            {{user.firstName}} {{user.lastName}}
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container" *ngIf="currentUser$ | async">
        <mat-sidenav #sidenav [mode]="sidenavMode" [opened]="sidenavOpened" class="sidenav">
          <mat-nav-list>
            <a mat-list-item (click)="navigateTo('/dashboard')" [class.active]="isActiveRoute('/dashboard')">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item (click)="navigateTo('/users')" [class.active]="isActiveRoute('/users')">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Users</span>
            </a>
            <a mat-list-item (click)="navigateTo('/customers')" [class.active]="isActiveRoute('/customers')">
              <mat-icon matListItemIcon>group</mat-icon>
              <span matListItemTitle>Customers</span>
            </a>
            <a mat-list-item (click)="navigateTo('/products')" [class.active]="isActiveRoute('/products')">
              <mat-icon matListItemIcon>inventory</mat-icon>
              <span matListItemTitle>Products</span>
            </a>
            <a mat-list-item (click)="navigateTo('/brands')" [class.active]="isActiveRoute('/brands')">
              <mat-icon matListItemIcon>business</mat-icon>
              <span matListItemTitle>Brands</span>
            </a>
            <a mat-list-item (click)="navigateTo('/categories')" [class.active]="isActiveRoute('/categories')">
              <mat-icon matListItemIcon>category</mat-icon>
              <span matListItemTitle>Categories</span>
            </a>
            <a mat-list-item (click)="navigateTo('/enquiries')" [class.active]="isActiveRoute('/enquiries')">
              <mat-icon matListItemIcon>help</mat-icon>
              <span matListItemTitle>Enquiries</span>
            </a>
            <a mat-list-item (click)="navigateTo('/quotations')" [class.active]="isActiveRoute('/quotations')">
              <mat-icon matListItemIcon>description</mat-icon>
              <span matListItemTitle>Quotations</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <div class="login-container" *ngIf="!(currentUser$ | async)">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .brand-toolbar {
      background: linear-gradient(135deg, #2653a6 0%, #4285f4 100%) !important;
      color: white !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    .app-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: white !important;
      letter-spacing: 0.5px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-menu {
      display: flex;
      align-items: center;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 249, 250, 0.95) 100%);
      border-right: 1px solid rgba(38, 83, 166, 0.12);
      box-shadow: 4px 0 16px rgba(38, 83, 166, 0.08);
      backdrop-filter: blur(10px);
    }

    .main-content {
      padding: 24px;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f1f5ff 100%);
      min-height: calc(100vh - 64px);
    }

    /* Enhanced Responsive Styles */
    @media (max-width: 1024px) {
      .sidenav {
        width: 200px;
      }
      
      .main-content {
        padding: 16px;
      }
      
      .app-title {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 280px;
      }
      
      .main-content {
        padding: 12px;
      }
      
      .app-title {
        font-size: 1rem;
        display: none;
      }
      
      .user-menu button {
        padding: 8px;
      }
      
      .user-menu button .mat-icon {
        margin-right: 4px;
      }
    }

    @media (max-width: 480px) {
      .app-toolbar {
        padding: 0 8px;
      }
      
      .main-content {
        padding: 8px;
      }
      
      .user-menu {
        gap: 4px;
      }
      
      .user-menu button {
        min-width: 40px;
        padding: 4px;
      }
    }

    .login-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }

    .active {
      background: rgba(0, 0, 0, 0.04);
    }

    .mat-mdc-list-item {
      cursor: pointer;
      border-radius: 12px;
      margin: 6px 16px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .mat-mdc-list-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #2653a6 0%, #ea3b26 100%);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .mat-mdc-list-item:hover {
      background: linear-gradient(135deg, rgba(38, 83, 166, 0.08) 0%, rgba(234, 59, 38, 0.03) 100%);
      transform: translateX(6px);
      box-shadow: 0 4px 12px rgba(38, 83, 166, 0.1);
    }

    .mat-mdc-list-item:hover::before {
      transform: scaleY(0.6);
    }

    .mat-mdc-list-item.active {
      background: linear-gradient(135deg, rgba(38, 83, 166, 0.15) 0%, rgba(234, 59, 38, 0.05) 100%);
      color: #2653a6;
      font-weight: 600;
      transform: translateX(8px);
      box-shadow: 0 6px 16px rgba(38, 83, 166, 0.15);
    }

    .mat-mdc-list-item.active::before {
      transform: scaleY(1);
    }

    .mat-mdc-list-item.active .mat-icon {
      color: #2653a6;
      transform: scale(1.1);
    }

    .mat-mdc-list-item .mat-icon {
      margin-right: 16px;
      transition: all 0.3s ease;
      color: #4b494c;
    }

    .mat-mdc-list-item:hover .mat-icon {
      color: #2653a6;
      transform: scale(1.05);
    }

    .mat-mdc-list-item [matListItemTitle] {
      font-weight: 500;
      color: #4b494c;
      transition: all 0.3s ease;
    }

    .mat-mdc-list-item:hover [matListItemTitle] {
      color: #2653a6;
      font-weight: 600;
    }

    .mat-mdc-list-item.active [matListItemTitle] {
      color: #2653a6;
      font-weight: 600;
    }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  currentUser$: Observable<UserDto | null>;
  sidenavOpened = true;
  sidenavMode: 'side' | 'over' = 'side';
  isDarkTheme = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private responsiveService: ResponsiveService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.themeService.currentTheme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });

    // Handle responsive behavior
    this.responsiveService.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.sidenavMode = 'over';
        this.sidenavOpened = false;
      } else {
        this.sidenavMode = 'side';
        this.sidenavOpened = true;
      }
    });
  }

  toggleSidenav() {
    if (this.sidenavMode === 'over') {
      this.sidenav.toggle();
    } else {
      this.sidenavOpened = !this.sidenavOpened;
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    console.log('Navigating to:', route);
    this.router.navigate([route]);
    
    // Close sidenav on mobile when navigation item is clicked
    if (this.sidenavMode === 'over') {
      this.sidenav.close();
    }
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}