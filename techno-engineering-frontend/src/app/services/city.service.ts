import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseListResponse, FilterBase } from '../models/base.dto';
import { CityDto, CreateCityDto, UpdateCityDto } from '../models/city.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private baseUrl = `${environment.apiUrl}/City`;

  constructor(private http: HttpClient) {}

  getCities(filter: FilterBase): Observable<BaseListResponse<CityDto>> {
    return this.http.post<BaseListResponse<CityDto>>(`${this.baseUrl}/cities`, filter);
  }

  getCityById(id: number): Observable<BaseResponse<CityDto>> {
    return this.http.get<BaseResponse<CityDto>>(`${this.baseUrl}/${id}`);
  }

  createCities(cities: CreateCityDto[]): Observable<BaseResponse<CityDto[]>> {
    return this.http.post<BaseResponse<CityDto[]>>(`${this.baseUrl}`, cities);
  }

  updateCity(city: UpdateCityDto): Observable<BaseResponse<CityDto>> {
    return this.http.put<BaseResponse<CityDto>>(`${this.baseUrl}/${city.id}`, city);
  }

  deleteCities(ids: number[]): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}`, { body: ids });
  }

  getAllCities(): Observable<BaseListResponse<CityDto>> {
    return this.getCities({ pageNumber: 1, take: 1000 });
  }
}