# Techno Engineering Solution - Documentation

## 1. Introduction
Techno Engineering Solution is a comprehensive web-based application designed to streamline product inquiries, quotations, and customer interactions. The platform features role-based access with two primary user types:

- **Admin**: Full system control including user, product, and customer management
- **Staff**: Focused on enquiry and quotation processing

Customers can browse products, create enquiries, and receive quotations through the platform.

## 2. System Overview

### Technology Stack
| Component       | Technology          |
|-----------------|---------------------|
| Backend         | .NET Core           |
| Frontend        | Angular             |
| Database        | SQL Server          |
| Authentication  | JWT/OAuth           |

### Core Modules
1. User Management
2. Product Management
3. Customer Management
4. Enquiry Management
5. Quotation Management

## 3. Functional Requirements

### 3.1 User Management

#### Admin Capabilities
- **Staff Management**:
  - Create/Edit/Delete staff accounts
  - Assign role-based permissions
- **System Configuration**:
  - Manage products, brands, categories
  - Handle customer records
  - Configure system settings

#### Staff Capabilities
- Process product enquiries
- Generate quotations
- Limited to permissions assigned by Admin

### 3.2 Staff Information Model

**Core Fields**:
- Personal Details:
  - Name
  - Email (unique)
  - Contact Number
- Address (linked to Address model):
  - Street Address
  - City
  - State
  - Pincode

**Permission Matrix**:
| Entity    | Add | Edit | Delete |
|-----------|-----|------|--------|
| Product   | ✓   | ✓    | ✓      |
| Brand     | ✓   | ✓    | ✓      |
| Category  | ✓   | ✓    | ✓      |
| Customer  | ✓   | ✓    | ✓      |
| Enquiry   | ✓   | ✓    | ✓      |
| Quotation | ✓   | ✓    | ✓      |

### 3.3 Product Management

**Product Attributes**:
- Basic Info:
  - Name
  - Description
  - Model Number (unique)
  - Material
- Relationships:
  - Brand (FK to Brand model)
  - Category (FK to Category model)
  - Color (optional FK to Color model)
- Media:
  - Multiple image URLs (stored as array)

**Functionalities**:
- CRUD operations for products
- Category/Brand filtering
- Unique model number validation
- Image management

### 3.4 Customer Management

**Customer Profile**:
- Personal Details:
  - Name
  - Organization
  - Mobile
  - Email
  - GSTIN
- Address:
  - Linked to Address model

**Customer Workflow**:
1. Browse products (guest access)
2. Register/login to create enquiries
3. Add products to cart/wishlist
4. Submit enquiries
5. Receive quotations

### 3.5 Enquiry Management

**Enquiry Structure**:
- Metadata:
  - Unique Enquiry Number
  - Creation Date
- Relationships:
  - Customer (FK)
  - Reporting Staff (FK)
- Content:
  - List of products with quantities

**Workflow**:
1. Customer creates enquiry
2. System generates enquiry number
3. Assigned to staff member
4. Staff processes enquiry → generates quotation

### 3.6 Quotation Management

**Quotation Header**:
- Identification:
  - Quotation Number
  - Creation Date
  - Estimate Date
- Addresses:
  - Billing Address (FK)
  - Shipping Address (FK)
- Tax Details:
  - Place of Supply
  - GST calculations

**Quotation Line Items**:
- Product Details:
  - Item Name
  - Description
  - HSN/SAC code
- Pricing:
  - Quantity
  - Rate
  - Tax Breakdown (CGST/SGST)
  - Line Total

**Workflow**:
1. Staff creates from enquiry
2. System auto-calculates taxes
3. Multiple delivery options
4. Sent via email + in-app notification

## 4. Non-Functional Requirements

### 4.1 Performance
- Response time < 2s for most operations
- Support 50+ concurrent users
- Optimized database queries

### 4.2 Security
- Role-based access control
- JWT authentication
- Data encryption at rest
- Regular security audits

### 4.3 Scalability
- Microservices architecture
- Database sharding capability
- Load-balanced web servers

### 4.4 Usability
- Responsive design (mobile/desktop)
- WCAG 2.1 AA compliance
- Intuitive navigation
- Contextual help system

### 4.5 Maintainability
- Clean architecture pattern
- Comprehensive documentation
- Unit test coverage > 80%
- CI/CD pipeline

## 5. Database Design

### Entity Relationship Diagram
```mermaid
erDiagram
    STAFF ||--o{ ADDRESS : has
    STAFF ||--o{ PERMISSION : has
    PRODUCT ||--|{ BRAND : belongs_to
    PRODUCT ||--|{ CATEGORY : belongs_to
    PRODUCT }|--|| COLOR : optional
    CUSTOMER ||--o{ ADDRESS : has
    ENQUIRY ||--o{ CUSTOMER : from
    ENQUIRY ||--o{ STAFF : handled_by
    QUOTATION ||--o{ ENQUIRY : based_on
    QUOTATION ||--|{ QUOTATION_ITEM : contains
    QUOTATION ||--o{ ADDRESS : bill_to
    QUOTATION ||--o{ ADDRESS : ship_to



