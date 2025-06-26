import { BaseDto } from './base.dto';
import { AddressDto } from './user.dto';

export interface CustomerDto extends BaseDto {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  contactNumber: string | null;
  gstin: string | null;
  organizationName: string | null;
  addresses: AddressDto[] | null;
  partyId: number;
}

export interface CustomerRegistrationDto {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  contactNumber: string | null;
  gstin: string | null;
  organizationName: string | null;
  password: string | null;
  confirmPassword: string | null;
  addressDtos: AddressDto[] | null;
}