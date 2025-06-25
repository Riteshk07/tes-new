import { BaseDto } from './base.dto';
import { AddressDto } from './user.dto';

export enum QuotationStatus {
  Draft = 0,
  Sent = 1,
  Accepted = 2,
  Rejected = 3,
  Expired = 4,
  Revised = 5
}

export interface QuotationItemDto {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  quotationId: number;
  hsN_SAC: string;
  quantity: number;
  rate: number;
  cgstAmount: number;
  sgstAmount: number;
  cgstPercentage: number;
  sgstPercentage: number;
  amount: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  lineTotal: number;
  product?: {
    id: number;
    name: string;
    description: string;
    modelNumber?: string;
  };
}

export interface QuotationDto extends BaseDto {
  customerId: number;
  userId: number;
  enquiryId?: number;
  quotationNumber: string;
  billToAddressId: number;
  shipToAddressId: number;
  estimateDate: string;
  placeOfSupply: string;
  quotationItems: QuotationItemDto[];
  
  // Extended properties for display
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerOrganization?: string;
  quotationDate?: string;
  validUntil?: string;
  reference?: string;
  notes?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  warranty?: string;
  status?: QuotationStatus;
  
  // Financial totals
  subtotal?: number;
  totalDiscount?: number;
  taxAmount?: number;
  grandTotal?: number;
  
  // Legacy support for existing components
  lineItems?: QuotationItemDto[];
}

export interface CreateQuotationDto {
  customerId: number;
  userId: number;
  quotationNumber: string;
  billToAddressId: number;
  shipToAddressId: number;
  estimateDate: string;
  placeOfSupply: string;
  quotationItems: QuotationItemDto[];
}

export interface UpdateQuotationDto {
  id: number;
  customerId?: number;
  userId?: number;
  quotationNumber?: string;
  billToAddressId?: number;
  shipToAddressId?: number;
  estimateDate?: string;
  placeOfSupply?: string;
  quotationItems?: QuotationItemDto[];
}

export interface QuotationSummaryDto {
  subtotal: number;
  totalDiscount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  totalAmount: number;
  itemCount: number;
}

export interface QuotationTemplateDto extends BaseDto {
  name: string;
  description?: string;
  termsAndConditions: string;
  paymentTerms: string;
  deliveryTerms: string;
  isDefault: boolean;
}