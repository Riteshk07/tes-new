import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseListResponse, FilterBase } from '../models/base.dto';
import { MaterialDto, CreateMaterialDto, UpdateMaterialDto } from '../models/material.dto';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseUrl = `${environment.apiUrl}/Material`;

  constructor(private http: HttpClient) {}

  getMaterials(filter: FilterBase): Observable<BaseListResponse<MaterialDto>> {
    return this.http.post<BaseListResponse<MaterialDto>>(`${this.baseUrl}/Materials`, filter);
  }

  getMaterialById(id: number): Observable<BaseResponse<MaterialDto>> {
    return this.http.get<BaseResponse<MaterialDto>>(`${this.baseUrl}/${id}`);
  }

  createMaterials(materials: CreateMaterialDto[]): Observable<BaseResponse<MaterialDto[]>> {
    return this.http.post<BaseResponse<MaterialDto[]>>(`${this.baseUrl}`, materials);
  }

  updateMaterial(material: UpdateMaterialDto): Observable<BaseResponse<MaterialDto>> {
    return this.http.put<BaseResponse<MaterialDto>>(`${this.baseUrl}/${material.id}`, material);
  }

  deleteMaterials(ids: number[]): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}`, { body: ids });
  }

  getAllMaterials(): Observable<BaseListResponse<MaterialDto>> {
    return this.getMaterials({ pageNumber: 1, take: 1000 });
  }
}