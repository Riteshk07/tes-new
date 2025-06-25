import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { CategoryDto } from '../models/category.dto';
import { Observable } from 'rxjs';
import { BaseListResponse, FilterBase } from '../models/base.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<CategoryDto> {
  constructor(http: HttpClient) {
    super(http, '/Category');
  }

  getCategories(filter: FilterBase): Observable<BaseListResponse<CategoryDto>> {
    return this.http.post<BaseListResponse<CategoryDto>>(`${this.baseUrl}/Categories`, filter);
  }
}