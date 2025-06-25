export interface MaterialDto {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface CreateMaterialDto {
  id: number;
  name: string;
}

export interface UpdateMaterialDto {
  id: number;
  name?: string;
  isActive?: boolean;
}