export interface CityDto {
  id: number;
  name: string;
  stateId?: number;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface CreateCityDto {
  id: number;
  name: string;
}

export interface UpdateCityDto {
  id: number;
  name?: string;
  isActive?: boolean;
}