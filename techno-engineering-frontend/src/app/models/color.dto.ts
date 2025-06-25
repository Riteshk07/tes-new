export interface ColorDto {
  id: number;
  name: string;
  hex: string;
  createdBy: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateColorDto {
  name: string;
  hex: string;
  createdBy: number;
  isActive: boolean;
}

export interface UpdateColorDto {
  id: number;
  name?: string;
  hex?: string;
  isActive?: boolean;
}