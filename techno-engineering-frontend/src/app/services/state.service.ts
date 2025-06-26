import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseListResponse, FilterBase } from '../models/base.dto';
import { StateDto, CreateStateDto, UpdateStateDto } from '../models/state.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private baseUrl = `${environment.apiUrl}/State`;

  constructor(private http: HttpClient) {}

  getStates(filter: FilterBase): Observable<BaseListResponse<StateDto>> {
    return this.http.post<BaseListResponse<StateDto>>(`${this.baseUrl}/states`, filter);
  }

  getStateById(id: number): Observable<BaseResponse<StateDto>> {
    return this.http.get<BaseResponse<StateDto>>(`${this.baseUrl}/${id}`);
  }

  createStates(states: CreateStateDto[]): Observable<BaseResponse<StateDto[]>> {
    return this.http.post<BaseResponse<StateDto[]>>(`${this.baseUrl}`, states);
  }

  updateState(state: UpdateStateDto): Observable<BaseResponse<StateDto>> {
    return this.http.put<BaseResponse<StateDto>>(`${this.baseUrl}/${state.id}`, state);
  }

  deleteStates(ids: number[]): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}`, { body: ids });
  }

  getAllStates(): Observable<BaseListResponse<StateDto>> {
    return this.getStates({ pageNumber: 1, take: 1000 });
  }
}