import { BaseDto } from './base.dto';

export interface BrandDto extends BaseDto {
  name: string | null;
}