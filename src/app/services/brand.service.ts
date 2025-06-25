import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { BrandDto } from '../models/brand.dto';
import { Observable } from 'rxjs';
import { BaseListResponse, FilterBase } from '../models/base.dto';

@Injectable({
  providedIn: 'root'
})
export class BrandService extends BaseService<BrandDto> {
  constructor(http: HttpClient) {
    super(http, '/Brand');
  }

  getBrands(filter: FilterBase): Observable<BaseListResponse<BrandDto>> {
    return this.http.post<BaseListResponse<BrandDto>>(`${this.baseUrl}/brands`, filter);
  }
}