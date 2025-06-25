# Complete cURL Commands for All API Endpoints

## Brand API Endpoints

### 1. Get Brands List (POST)
```bash
curl -X POST "https://api.example.com/api/Brand/brands" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 10,
    "search": "brand name",
    "startDate": null,
    "endDate": null,
    "dateType": 0,
    "ordersType": 0,
    "orderBy": "name"
  }'
```

### 2. Create Brands (POST)
```bash
curl -X POST "https://api.example.com/api/Brand" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[
    {
      "id": 0,
      "name": "Apple"
    },
    {
      "id": 0,
      "name": "Samsung"
    }
  ]'
```

### 3. Delete Brands (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/Brand" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3]'
```

## Category API Endpoints

### 4. Get Categories List (POST)
```bash
curl -X POST "https://api.example.com/api/Category/Categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 20,
    "search": "electronics",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "dateType": 0,
    "ordersType": 1,
    "orderBy": "createdAt"
  }'
```

### 5. Create Categories (POST)
```bash
curl -X POST "https://api.example.com/api/Category" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[
    {
      "name": "Electronics",
      "isActive": true,
      "createdBy": 1
    },
    {
      "name": "Clothing",
      "isActive": true,
      "createdBy": 1
    }
  ]'
```

### 6. Delete Categories (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/Category" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3, 4]'
```

## City API Endpoints

### 7. Get Cities List (POST)
```bash
curl -X POST "https://api.example.com/api/City/cities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 50,
    "search": "Mumbai",
    "ordersType": 0,
    "orderBy": "name"
  }'
```

### 8. Create Cities (POST)
```bash
curl -X POST "https://api.example.com/api/City" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[
    {
      "id": 0,
      "name": "Mumbai"
    },
    {
      "id": 0,
      "name": "Delhi"
    },
    {
      "id": 0,
      "name": "Bangalore"
    }
  ]'
```

### 9. Delete Cities (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/City" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3]'
```

## Color API Endpoints

### 10. Get Colors List (POST)
```bash
curl -X POST "https://api.example.com/api/Color/colors" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 25,
    "search": "red",
    "ordersType": 0,
    "orderBy": "name"
  }'
```

### 11. Create Colors (POST)
```bash
curl -X POST "https://api.example.com/api/Color" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[
    {
      "name": "Red",
      "hex": "#FF0000",
      "createdBy": 1,
      "isActive": true
    },
    {
      "name": "Blue",
      "hex": "#0000FF",
      "createdBy": 1,
      "isActive": true
    },
    {
      "name": "Green",
      "hex": "#00FF00",
      "createdBy": 1,
      "isActive": true
    }
  ]'
```

### 12. Delete Colors (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/Color" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3]'
```

## Customer API Endpoints

### 13. Customer Registration (POST)
```bash
curl -X POST "https://api.example.com/api/Customer/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "contactNumber": "9876543210",
    "gstin": "29ABCDE1234F1Z5",
    "organizationName": "John Doe Enterprises",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!",
    "addressDtos": [
      {
        "cityId": 1,
        "stateId": 1,
        "pincode": "400001",
        "addressDetail": "123 Main Street, Apartment 4B",
        "partyId": 0
      }
    ]
  }'
```

### 14. Get Current Customer (GET)
```bash
curl -X GET "https://api.example.com/api/Customer/current" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 15. Get Customer by ID (GET)
```bash
curl -X GET "https://api.example.com/api/Customer/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 16. Get Customers List (POST)
```bash
curl -X POST "https://api.example.com/api/Customer/customers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 15,
    "search": "john",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "dateType": 0,
    "ordersType": 1,
    "orderBy": "firstName"
  }'
```

### 17. Change Customer Password (POST)
```bash
curl -X POST "https://api.example.com/api/Customer/change-password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "newPassword": "NewSecurePassword456!"
  }'
```

### 18. Customer Forget Password (POST)
```bash
curl -X POST "https://api.example.com/api/Customer/forget-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

## Enquiry API Endpoints

### 19. Get Enquiries List (POST)
```bash
curl -X POST "https://api.example.com/api/Enquiry/enquiries" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 10,
    "search": "enquiry",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "dateType": 0,
    "ordersType": 1,
    "orderBy": "createdAt"
  }'
```

### 20. Get Enquiry by ID (GET)
```bash
curl -X GET "https://api.example.com/api/Enquiry/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 21. Create Enquiry (POST)
```bash
curl -X POST "https://api.example.com/api/Enquiry" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": 1,
    "enquiryNumber": "ENQ-2024-001",
    "reportedBy": 1,
    "enquiredProducts": [
      {
        "quantity": 10,
        "productId": 1,
        "unitPrice": 150.00,
        "totalPrice": 1500.00
      },
      {
        "quantity": 5,
        "productId": 2,
        "unitPrice": 200.00,
        "totalPrice": 1000.00
      }
    ]
  }'
```

### 22. Delete Enquiries (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/Enquiry" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3]'
```

## Material API Endpoints

### 23. Get Materials List (POST)
```bash
curl -X POST "https://api.example.com/api/Material/Materials" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 30,
    "search": "steel",
    "ordersType": 0,
    "orderBy": "name"
  }'
```

### 24. Create Materials (POST)
```bash
curl -X POST "https://api.example.com/api/Material" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[
    {
      "id": 0,
      "name": "Stainless Steel"
    },
    {
      "id": 0,
      "name": "Aluminum"
    },
    {
      "id": 0,
      "name": "Plastic"
    },
    {
      "id": 0,
      "name": "Wood"
    }
  ]'
```

### 25. Delete Materials (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/Material" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3, 4]'
```

## Product API Endpoints

### 26. Get Products List (POST)
```bash
curl -X POST "https://api.example.com/api/Product/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 12,
    "search": "smartphone",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "dateType": 0,
    "ordersType": 0,
    "orderBy": "name"
  }'
```

### 27. Get Product by ID (GET)
```bash
curl -X GET "https://api.example.com/api/Product/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 28. Create Product (POST)
```bash
curl -X POST "https://api.example.com/api/Product" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features and improved camera system",
    "brandId": 1,
    "categoryId": 1,
    "modelNumber": "A2848",
    "imageUrls": [
      "https://example.com/images/iphone15pro_1.jpg",
      "https://example.com/images/iphone15pro_2.jpg",
      "https://example.com/images/iphone15pro_3.jpg"
    ],
    "colorId": 1,
    "materialIds": [1, 2],
    "minimumBuyingQuantity": 1,
    "isActive": true,
    "createdBy": 1
  }'
```

### 29. Delete Products (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/Product" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3]'
```

## Quotation API Endpoints

### 30. Get Quotations List (POST)
```bash
curl -X POST "https://api.example.com/api/Quotation/quotations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 10,
    "search": "quotation",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "dateType": 0,
    "ordersType": 1,
    "orderBy": "createdAt"
  }'
```

### 31. Get Quotation by ID (GET)
```bash
curl -X GET "https://api.example.com/api/Quotation/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 32. Create Quotation (POST)
```bash
curl -X POST "https://api.example.com/api/Quotation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": 1,
    "userId": 1,
    "quotationNumber": "QUO-2024-001",
    "billToAddressId": 1,
    "shipToAddressId": 2,
    "estimateDate": "2024-12-31T00:00:00Z",
    "placeOfSupply": "Mumbai, Maharashtra",
    "quotationItems": [
      {
        "productId": 1,
        "hsN_SAC": "8517",
        "quantity": 2,
        "rate": 75000.00,
        "cgstAmount": 6750.00,
        "sgstAmount": 6750.00,
        "cgstPercentage": 9.0,
        "sgstPercentage": 9.0,
        "amount": 163500.00
      },
      {
        "productId": 2,
        "hsN_SAC": "8517",
        "quantity": 1,
        "rate": 25000.00,
        "cgstAmount": 2250.00,
        "sgstAmount": 2250.00,
        "cgstPercentage": 9.0,
        "sgstPercentage": 9.0,
        "amount": 29500.00
      }
    ]
  }'
```

### 33. Delete Quotations (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/Quotation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3]'
```

## State API Endpoints

### 34. Get States List (POST)
```bash
curl -X POST "https://api.example.com/api/State/states" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 50,
    "search": "maharashtra",
    "ordersType": 0,
    "orderBy": "name"
  }'
```

### 35. Create States (POST)
```bash
curl -X POST "https://api.example.com/api/State" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[
    {
      "id": 0,
      "name": "Maharashtra"
    },
    {
      "id": 0,
      "name": "Karnataka"
    },
    {
      "id": 0,
      "name": "Tamil Nadu"
    },
    {
      "id": 0,
      "name": "Gujarat"
    }
  ]'
```

### 36. Delete States (DELETE)
```bash
curl -X DELETE "https://api.example.com/api/State" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '[1, 2, 3]'
```

## User API Endpoints

### 37. User Upsert (POST)
```bash
curl -X POST "https://api.example.com/api/User/upsert" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "contactNumber": "9876543210",
    "permissions": 31,
    "password": "AdminPassword123!",
    "confirmPassword": "AdminPassword123!",
    "addressDtos": [
      {
        "cityId": 1,
        "stateId": 1,
        "pincode": "400001",
        "addressDetail": "Admin Office, 456 Business Street"
      }
    ]
  }'
```

### 38. User Login (POST)
```bash
curl -X POST "https://api.example.com/api/User/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@example.com",
    "password": "AdminPassword123!"
  }'
```

### 39. Get Current User (GET)
```bash
curl -X GET "https://api.example.com/api/User/current" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 40. Get User by ID (GET)
```bash
curl -X GET "https://api.example.com/api/User/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 41. Get Users List (POST)
```bash
curl -X POST "https://api.example.com/api/User/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pageNumber": 1,
    "take": 20,
    "search": "admin",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "dateType": 0,
    "ordersType": 1,
    "orderBy": "firstName"
  }'
```

### 42. Change User Password (POST)
```bash
curl -X POST "https://api.example.com/api/User/change-password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "newPassword": "NewAdminPassword456!"
  }'
```

### 43. User Forget Password (POST)
```bash
curl -X POST "https://api.example.com/api/User/forget-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com"
  }'
```

## Summary

**Total Endpoints: 43**

### Breakdown by Entity:
- **Brand**: 3 endpoints (GET list, POST create, DELETE)
- **Category**: 3 endpoints (GET list, POST create, DELETE)
- **City**: 3 endpoints (GET list, POST create, DELETE)
- **Color**: 3 endpoints (GET list, POST create, DELETE)
- **Customer**: 6 endpoints (Register, GET current, GET by ID, GET list, Change password, Forget password)
- **Enquiry**: 4 endpoints (GET list, GET by ID, POST create, DELETE)
- **Material**: 3 endpoints (GET list, POST create, DELETE)
- **Product**: 4 endpoints (GET list, GET by ID, POST create, DELETE)
- **Quotation**: 4 endpoints (GET list, GET by ID, POST create, DELETE)
- **State**: 3 endpoints (GET list, POST create, DELETE)
- **User**: 7 endpoints (Upsert, Login, GET current, GET by ID, GET list, Change password, Forget password)

### HTTP Methods Used:
- **GET**: 7 endpoints
- **POST**: 32 endpoints
- **DELETE**: 11 endpoints

### Authentication Requirements:
- **Public endpoints**: 4 (Customer registration, Customer forget password, User login, User forget password)
- **Protected endpoints**: 39 (Require Bearer token)

**Note**: Replace `https://api.example.com` with your actual API base URL and `YOUR_TOKEN` with a valid JWT token for authenticated endpoints.