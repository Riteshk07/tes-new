import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseDto, BaseListResponse, BaseResponse, FilterBase } from '../models/base.dto';
import { environment } from '../../environments/environment';

export abstract class BaseService<T extends BaseDto> {
  protected constructor(protected http: HttpClient, protected endpoint: string) {}

  protected get baseUrl(): string {
    return `${environment.apiUrl}${this.endpoint}`;
  }

  getAll(filter: FilterBase): Observable<BaseListResponse<T>> {
    return this.http.post<BaseListResponse<T>>(`${this.baseUrl}`, filter);
  }

  create(items: T[]): Observable<BaseListResponse<T>> {
    return this.http.post<BaseListResponse<T>>(`${this.baseUrl}`, items);
  }

  delete(ids: number[]): Observable<BaseResponse<number>> {
    return this.http.delete<BaseResponse<number>>(`${this.baseUrl}`, { body: ids });
  }

  getById(id: number): Observable<BaseResponse<T>> {
    return this.http.get<BaseResponse<T>>(`${this.baseUrl}/${id}`);
  }
}