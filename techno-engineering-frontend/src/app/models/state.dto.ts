export interface StateDto {
  id: number;
  name: string;
  code?: string;
  countryId?: number;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface CreateStateDto {
  id: number;
  name: string;
}

export interface UpdateStateDto {
  id: number;
  name?: string;
  code?: string;
  isActive?: boolean;
}