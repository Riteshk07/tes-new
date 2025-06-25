import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseListResponse, FilterBase } from '../models/base.dto';
import { QuotationDto, CreateQuotationDto, UpdateQuotationDto, QuotationSummaryDto, QuotationTemplateDto, QuotationStatus } from '../models/quotation.dto';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private baseUrl = `${environment.apiUrl}/Quotation`;

  constructor(private http: HttpClient) {}

  getQuotations(filter: FilterBase): Observable<BaseListResponse<QuotationDto>> {
    return this.http.post<BaseListResponse<QuotationDto>>(`${this.baseUrl}/quotations`, filter);
  }

  getQuotationById(id: number): Observable<BaseResponse<QuotationDto>> {
    return this.http.get<BaseResponse<QuotationDto>>(`${this.baseUrl}/${id}`);
  }

  createQuotation(quotation: CreateQuotationDto): Observable<BaseResponse<QuotationDto>> {
    return this.http.post<BaseResponse<QuotationDto>>(`${this.baseUrl}`, quotation);
  }

  createFromEnquiry(enquiryId: number): Observable<BaseResponse<QuotationDto>> {
    return this.http.post<BaseResponse<QuotationDto>>(`${this.baseUrl}/from-enquiry/${enquiryId}`, {});
  }

  updateQuotation(quotation: UpdateQuotationDto): Observable<BaseResponse<QuotationDto>> {
    return this.http.put<BaseResponse<QuotationDto>>(`${this.baseUrl}/${quotation.id}`, quotation);
  }

  deleteQuotations(ids: number[]): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}`, { body: ids });
  }

  updateQuotationStatus(id: number, status: QuotationStatus): Observable<BaseResponse<any>> {
    return this.http.patch<BaseResponse<any>>(`${this.baseUrl}/${id}/status`, { status });
  }

  calculateQuotationSummary(lineItems: any[]): Observable<BaseResponse<QuotationSummaryDto>> {
    return this.http.post<BaseResponse<QuotationSummaryDto>>(`${this.baseUrl}/calculate-summary`, { lineItems });
  }

  generateQuotationPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  sendQuotationEmail(id: number, emailAddresses: string[], message?: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/${id}/send-email`, {
      emailAddresses,
      message
    });
  }

  duplicateQuotation(id: number): Observable<BaseResponse<QuotationDto>> {
    return this.http.post<BaseResponse<QuotationDto>>(`${this.baseUrl}/${id}/duplicate`, {});
  }

  createRevision(id: number, changes: Partial<CreateQuotationDto>): Observable<BaseResponse<QuotationDto>> {
    return this.http.post<BaseResponse<QuotationDto>>(`${this.baseUrl}/${id}/revise`, changes);
  }

  getQuotationVersions(id: number): Observable<BaseListResponse<QuotationDto>> {
    return this.http.get<BaseListResponse<QuotationDto>>(`${this.baseUrl}/${id}/versions`);
  }

  deleteQuotation(id: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}/${id}`);
  }

  // Template Management
  getQuotationTemplates(): Observable<BaseListResponse<QuotationTemplateDto>> {
    return this.http.get<BaseListResponse<QuotationTemplateDto>>(`${this.baseUrl}/templates`);
  }

  createQuotationTemplate(template: Omit<QuotationTemplateDto, 'id' | 'createdAt' | 'updatedAt'>): Observable<BaseResponse<QuotationTemplateDto>> {
    return this.http.post<BaseResponse<QuotationTemplateDto>>(`${this.baseUrl}/templates`, template);
  }

  updateQuotationTemplate(id: number, template: Partial<QuotationTemplateDto>): Observable<BaseResponse<QuotationTemplateDto>> {
    return this.http.put<BaseResponse<QuotationTemplateDto>>(`${this.baseUrl}/templates/${id}`, template);
  }

  deleteQuotationTemplate(id: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}/templates/${id}`);
  }

  // Customer specific methods
  getCustomerQuotations(customerId: number, filter: FilterBase): Observable<BaseListResponse<QuotationDto>> {
    return this.http.post<BaseListResponse<QuotationDto>>(`${this.baseUrl}/customer/${customerId}`, filter);
  }

  acceptQuotation(id: number): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/${id}/accept`, {});
  }

  rejectQuotation(id: number, reason?: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/${id}/reject`, { reason });
  }
}