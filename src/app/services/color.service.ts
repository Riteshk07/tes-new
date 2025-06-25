import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseListResponse, FilterBase } from '../models/base.dto';
import { ColorDto, CreateColorDto, UpdateColorDto } from '../models/color.dto';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private baseUrl = `${environment.apiUrl}/Color`;

  constructor(private http: HttpClient) {}

  getColors(filter: FilterBase): Observable<BaseListResponse<ColorDto>> {
    return this.http.post<BaseListResponse<ColorDto>>(`${this.baseUrl}/colors`, filter);
  }

  getColorById(id: number): Observable<BaseResponse<ColorDto>> {
    return this.http.get<BaseResponse<ColorDto>>(`${this.baseUrl}/${id}`);
  }

  createColors(colors: CreateColorDto[]): Observable<BaseResponse<ColorDto[]>> {
    return this.http.post<BaseResponse<ColorDto[]>>(`${this.baseUrl}`, colors);
  }

  updateColor(color: UpdateColorDto): Observable<BaseResponse<ColorDto>> {
    return this.http.put<BaseResponse<ColorDto>>(`${this.baseUrl}/${color.id}`, color);
  }

  deleteColors(ids: number[]): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}`, { body: ids });
  }

  getAllColors(): Observable<BaseListResponse<ColorDto>> {
    return this.getColors({ pageNumber: 1, take: 1000 });
  }
}