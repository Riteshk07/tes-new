import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { LoginDto, AuthResponseDto, UserDto } from '../models/user.dto';
import { BaseResponse } from '../models/base.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  login(credentials: LoginDto): Observable<BaseResponse<UserDto>> {
    return this.http.post<AuthResponseDto>(`${environment.apiUrl}/User/login`, credentials)
      .pipe(
        tap(authResponse => {
          // Store the token immediately
          this.tokenSubject.next(authResponse.token);
          localStorage.setItem('token', authResponse.token);
        }),
        switchMap(authResponse => {
          // After getting token, fetch user details
          return this.getCurrentUser();
        }),
        tap(userResponse => {
          if (userResponse.status && userResponse.data) {
            // Store user data
            this.currentUserSubject.next(userResponse.data);
            localStorage.setItem('user', JSON.stringify(userResponse.data));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  getCurrentUser(): Observable<BaseResponse<UserDto>> {
    return this.http.get<BaseResponse<UserDto>>(`${environment.apiUrl}/User/current`);
  }

  changePassword(newPassword: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${environment.apiUrl}/User/change-password`, { newPassword });
  }

  forgotPassword(email: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${environment.apiUrl}/User/forget-password`, { email });
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUserValue(): UserDto | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  private setUser(user: UserDto): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }
}