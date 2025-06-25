export interface BaseResponse<T> {
  data: T;
  count: number;
  message: string | null;
  status: boolean;
  statusCode: number;
}

export interface BaseListResponse<T> extends BaseResponse<T[]> {}

export interface BaseDto {
  id: number;
  createdAt?: string;
  updatedAt?: string | null;
  createdBy?: number;
  updatedBy?: number | null;
  isActive?: boolean;
}

export enum DateType {
  Created = 0,
  Updated = 1,
  Custom = 2
}

export enum OrderType {
  Asc = 0,
  Desc = 1
}

export interface FilterBase {
  pageNumber?: number | null;
  take?: number | null;
  search?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  dateType?: DateType;
  ordersType?: OrderType;
  orderBy?: string | null;
}