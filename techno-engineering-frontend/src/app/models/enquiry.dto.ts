import { BaseDto } from './base.dto';

export enum EnquiryStatus {
  Pending = 0,
  InProgress = 1,
  Quoted = 2,
  Completed = 3,
  Cancelled = 4
}

export interface EnquiredProductDto {
  id: number;
  enquiryId: number;
  quantity: number;
  productId: number;
  productName: string;
  productModel: string;
  unitPrice: number;
  estimatedPrice: number;
  notes: string;
  product?: {
    id: number;
    name: string;
    modelNumber: string;
    description?: string;
  };
}

export interface EnquiryDto extends BaseDto {
  customerId: number;
  enquiryNumber: string;
  reportedBy: number;
  enquiredProducts: EnquiredProductDto[];
  status?: EnquiryStatus;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject?: string;
  description?: string;
  requirementDate?: string;
  budgetRange?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  organizationName?: string;
  assignedStaffId?: number;
  assignedStaffName?: string;
  totalEstimatedValue?: number;
  quotationId?: number;
  quotationNumber?: string;
  notes?: string;
  attachments?: string[];
  // Legacy support for existing components
  items?: EnquiredProductDto[];
}

export interface CreateEnquiryDto {
  customerId: number;
  enquiryNumber: string;
  reportedBy: number;
  enquiredProducts: EnquiredProductDto[];
}

export interface UpdateEnquiryDto {
  id: number;
  customerId?: number;
  enquiryNumber?: string;
  reportedBy?: number;
  enquiredProducts?: EnquiredProductDto[];
  status?: EnquiryStatus;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject?: string;
  description?: string;
  requirementDate?: string;
  budgetRange?: string;
}

export interface EnquiryCommentDto extends BaseDto {
  enquiryId: number;
  userId: number;
  userName: string;
  userRole: string;
  comment: string;
  isInternal: boolean;
}

export interface EnquiryActivityDto extends BaseDto {
  enquiryId: number;
  activityType: 'Created' | 'StatusChanged' | 'Assigned' | 'CommentAdded' | 'QuotationGenerated' | 'Updated';
  description: string;
  userId: number;
  userName: string;
  oldValue?: string;
  newValue?: string;
}