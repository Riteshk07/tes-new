import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ProductDto } from '../models/product.dto';
import { Observable } from 'rxjs';
import { BaseListResponse, BaseResponse, FilterBase } from '../models/base.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<ProductDto> {
  constructor(http: HttpClient) {
    super(http, '/Product');
  }

  getProducts(filter: FilterBase): Observable<BaseListResponse<ProductDto>> {
    return this.http.post<BaseListResponse<ProductDto>>(`${this.baseUrl}/products`, filter);
  }

  uploadImages(productId: number, files: FileList): Observable<BaseResponse<string[]>> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    formData.append('productId', productId.toString());
    
    return this.http.post<BaseResponse<string[]>>(`${this.baseUrl}/upload-images`, formData);
  }

  deleteImage(productId: number, imageUrl: string): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.baseUrl}/${productId}/images`, {
      body: { imageUrl }
    });
  }
}