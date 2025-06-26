import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseListResponse, FilterBase } from '../models/base.dto';
import { CustomerDto, CustomerRegistrationDto } from '../models/customer.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = `${environment.apiUrl}/Customer`;

  constructor(private http: HttpClient) {}

  registerCustomer(customer: CustomerRegistrationDto): Observable<BaseResponse<CustomerDto>> {
    return this.http.post<BaseResponse<CustomerDto>>(`${this.baseUrl}/register`, customer);
  }

  getCurrentCustomer(): Observable<BaseResponse<CustomerDto>> {
    return this.http.get<BaseResponse<CustomerDto>>(`${this.baseUrl}/current`);
  }

  getCustomerById(id: number): Observable<BaseResponse<CustomerDto>> {
    return this.http.get<BaseResponse<CustomerDto>>(`${this.baseUrl}/${id}`);
  }

  getCustomers(filter: FilterBase): Observable<BaseListResponse<CustomerDto>> {
    return this.http.post<BaseListResponse<CustomerDto>>(`${this.baseUrl}/customers`, filter);
  }

  updateCustomer(id: number, customer: Partial<CustomerDto>): Observable<BaseResponse<CustomerDto>> {
    return this.http.put<BaseResponse<CustomerDto>>(`${this.baseUrl}/${id}`, customer);
  }

  changeCustomerPassword(newPassword: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/change-password`, { newPassword });
  }

  forgetPassword(email: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/forget-password`, { email });
  }

  deleteCustomer(id: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}/${id}`);
  }

  getAllCustomers(): Observable<BaseListResponse<CustomerDto>> {
    return this.getCustomers({ pageNumber: 1, take: 1000 });
  }
}