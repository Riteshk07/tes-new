import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseListResponse, FilterBase } from '../models/base.dto';
import { UserDto, CreateUserDto } from '../models/user.dto';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  upsertUser(user: CreateUserDto): Observable<BaseResponse<UserDto>> {
    return this.http.post<BaseResponse<UserDto>>(`${this.baseUrl}/upsert`, user);
  }

  getCurrentUser(): Observable<BaseResponse<UserDto>> {
    return this.http.get<BaseResponse<UserDto>>(`${this.baseUrl}/current`);
  }

  getUserById(id: number): Observable<BaseResponse<UserDto>> {
    return this.http.get<BaseResponse<UserDto>>(`${this.baseUrl}/${id}`);
  }

  getUsers(filter: FilterBase): Observable<BaseListResponse<UserDto>> {
    return this.http.post<BaseListResponse<UserDto>>(`${this.baseUrl}/users`, filter);
  }

  updateUser(id: number, user: Partial<UserDto>): Observable<BaseResponse<UserDto>> {
    return this.http.put<BaseResponse<UserDto>>(`${this.baseUrl}/${id}`, user);
  }

  changeUserPassword(newPassword: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/change-password`, { newPassword });
  }

  forgetPassword(email: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/forget-password`, { email });
  }

  deleteUser(id: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}/${id}`);
  }

  getAllUsers(): Observable<BaseListResponse<UserDto>> {
    return this.getUsers({ pageNumber: 1, take: 1000 });
  }
}