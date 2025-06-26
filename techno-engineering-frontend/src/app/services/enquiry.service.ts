import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseListResponse, FilterBase } from '../models/base.dto';
import { EnquiryDto, CreateEnquiryDto, UpdateEnquiryDto, EnquiryCommentDto, EnquiryActivityDto, EnquiryStatus } from '../models/enquiry.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private baseUrl = `${environment.apiUrl}/Enquiry`;

  constructor(private http: HttpClient) {}

  getEnquiries(filter: FilterBase): Observable<BaseListResponse<EnquiryDto>> {
    return this.http.post<BaseListResponse<EnquiryDto>>(`${this.baseUrl}/enquiries`, filter);
  }

  getEnquiryById(id: number): Observable<BaseResponse<EnquiryDto>> {
    return this.http.get<BaseResponse<EnquiryDto>>(`${this.baseUrl}/${id}`);
  }

  createEnquiry(enquiry: CreateEnquiryDto): Observable<BaseResponse<EnquiryDto>> {
    return this.http.post<BaseResponse<EnquiryDto>>(`${this.baseUrl}`, enquiry);
  }

  updateEnquiry(enquiry: UpdateEnquiryDto): Observable<BaseResponse<EnquiryDto>> {
    return this.http.put<BaseResponse<EnquiryDto>>(`${this.baseUrl}/${enquiry.id}`, enquiry);
  }

  deleteEnquiries(ids: number[]): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}`, { body: ids });
  }

  updateEnquiryStatus(id: number, status: EnquiryStatus): Observable<BaseResponse<any>> {
    return this.http.patch<BaseResponse<any>>(`${this.baseUrl}/${id}/status`, { status });
  }

  assignEnquiry(id: number, staffId: number): Observable<BaseResponse<any>> {
    return this.http.patch<BaseResponse<any>>(`${this.baseUrl}/${id}/assign`, { staffId });
  }

  getEnquiryComments(enquiryId: number): Observable<BaseListResponse<EnquiryCommentDto>> {
    return this.http.get<BaseListResponse<EnquiryCommentDto>>(`${this.baseUrl}/${enquiryId}/comments`);
  }

  addEnquiryComment(enquiryId: number, comment: string, isInternal: boolean = false): Observable<BaseResponse<EnquiryCommentDto>> {
    return this.http.post<BaseResponse<EnquiryCommentDto>>(`${this.baseUrl}/${enquiryId}/comments`, {
      comment,
      isInternal
    });
  }

  getEnquiryActivities(enquiryId: number): Observable<BaseListResponse<EnquiryActivityDto>> {
    return this.http.get<BaseListResponse<EnquiryActivityDto>>(`${this.baseUrl}/${enquiryId}/activities`);
  }

  deleteEnquiry(id: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}/${id}`);
  }

  exportEnquiry(id: number, format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/export/${format}`, {
      responseType: 'blob'
    });
  }

  getMyEnquiries(customerId: number, filter: FilterBase): Observable<BaseListResponse<EnquiryDto>> {
    return this.http.post<BaseListResponse<EnquiryDto>>(`${this.baseUrl}/customer/${customerId}`, filter);
  }

  getStaffEnquiries(staffId: number, filter: FilterBase): Observable<BaseListResponse<EnquiryDto>> {
    return this.http.post<BaseListResponse<EnquiryDto>>(`${this.baseUrl}/staff/${staffId}`, filter);
  }
}