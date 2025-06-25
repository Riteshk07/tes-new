import { BaseDto } from './base.dto';

export enum Permissions {
  ReadUsers = 1,
  WriteUsers = 2,
  ReadProducts = 4,
  WriteProducts = 8,
  ReadCustomers = 16,
  WriteCustomers = 32,
  ReadEnquiries = 64,
  WriteEnquiries = 128,
  ReadQuotations = 256,
  WriteQuotations = 512
}

export interface AddressDto {
  id: number;
  cityId: number;
  pincode: string | null;
  stateId: number;
  state: string | null;
  city: string | null;
  addressDetail: string | null;
  partyId: number;
}

export interface UserDto extends BaseDto {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  contactNumber: string | null;
  phoneNumber?: string | null;
  role?: string | null;
  permissions: Permissions;
  addresses: AddressDto[] | null;
  partyId: number;
}

export interface UserRegisterDto {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  contactNumber: string | null;
  permissions: Permissions;
  password: string | null;
  confirmPassword: string | null;
  addressDtos: AddressDto[] | null;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
}