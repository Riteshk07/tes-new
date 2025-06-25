import { BaseDto } from './base.dto';
import { ColorDto } from './color.dto';
import { MaterialDto } from './material.dto';

export interface ProductDto extends BaseDto {
  name: string;
  description: string;
  brandId: number;
  categoryId: number;
  modelNumber: string;
  imageUrls: string[];
  colorId: number;
  materialIds: number[];
  brand?: string;
  category?: string;
  color?: ColorDto;
  materials?: MaterialDto[];
  minimumBuyingQuantity: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  brandId: number;
  categoryId: number;
  modelNumber: string;
  imageUrls: string[];
  colorId: number;
  materialIds: number[];
  minimumBuyingQuantity: number;
  isActive: boolean;
  createdBy: number;
}

export interface UpdateProductDto {
  id: number;
  name?: string;
  description?: string;
  brandId?: number;
  categoryId?: number;
  modelNumber?: string;
  imageUrls?: string[];
  colorId?: number;
  materialIds?: number[];
  minimumBuyingQuantity?: number;
  isActive?: boolean;
}