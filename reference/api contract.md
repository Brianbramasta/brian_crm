# API Contract - PT. Smart CRM

## Overview

Dokumentasi API untuk aplikasi **CRM (Customer Relationship Management) PT. Smart**.  
Semua response menggunakan format JSON dengan standar HTTP status code.

---

## Authentication

### Login

-   **Endpoint**: `/api/auth/login`
-   **Method**: `POST`
-   **Request Body**:

```json
{
    "email": "sales@ptsmart.com",
    "password": "password123"
}
```

-   **Response**:

```json
{
    "token": "jwt_token",
    "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "sales|manager"
    }
}
```

### Logout

-   **Endpoint**: `/api/auth/logout`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
{
    "message": "Successfully logged out"
}
```

### Get Current User

-   **Endpoint**: `/api/user`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "sales|manager"
}
```

---

## Leads Management

### 1. Get All Leads

-   **Endpoint**: `/api/leads`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Query Parameters**:
    -   `status` (optional): `new|contacted|qualified|proposal|negotiation|closed_won|closed_lost`
    -   `page` (optional): pagination
-   **Response**:

```json
{
    "data": [
        {
            "id": "string",
            "name": "string",
            "email": "string",
            "phone": "string",
            "address": "string",
            "needs": "string",
            "status": "new",
            "sales_id": "string",
            "created_at": "2025-09-03T00:00:00Z",
            "updated_at": "2025-09-03T00:00:00Z"
        }
    ],
    "meta": {
        "current_page": 1,
        "per_page": 15,
        "total": 100
    }
}
```

### 2. Create Lead

-   **Endpoint**: `/api/leads`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "needs": "string",
    "status": "new"
}
```

-   **Response**:

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "needs": "string",
    "status": "new",
    "sales_id": "string",
    "created_at": "2025-09-03T00:00:00Z"
}
```

### 3. Update Lead

-   **Endpoint**: `/api/leads/{id}`
-   **Method**: `PUT`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "needs": "string",
    "status": "qualified"
}
```

-   **Response**:

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "needs": "string",
    "status": "qualified",
    "updated_at": "2025-09-03T00:00:00Z"
}
```

### 4. Delete Lead

-   **Endpoint**: `/api/leads/{id}`
-   **Method**: `DELETE`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
{
    "message": "Lead deleted successfully"
}
```

---

## Products Management

### 1. Get All Products

-   **Endpoint**: `/api/products`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
[
    {
        "id": "string",
        "name": "Paket Internet 50Mbps",
        "description": "string",
        "hpp": 200000,
        "margin_percentage": 25,
        "selling_price": 250000,
        "is_active": true,
        "created_at": "2025-09-03T00:00:00Z"
    }
]
```

### 2. Create Product

-   **Endpoint**: `/api/products`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "name": "Paket Internet 100Mbps",
    "description": "string",
    "hpp": 300000,
    "margin_percentage": 30
}
```

-   **Response**:

```json
{
    "id": "string",
    "name": "Paket Internet 100Mbps",
    "description": "string",
    "hpp": 300000,
    "margin_percentage": 30,
    "selling_price": 390000,
    "is_active": true,
    "created_at": "2025-09-03T00:00:00Z"
}
```

### 3. Update Product

-   **Endpoint**: `/api/products/{id}`
-   **Method**: `PUT`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "name": "string",
    "description": "string",
    "hpp": 350000,
    "margin_percentage": 25,
    "is_active": true
}
```

### 4. Delete Product

-   **Endpoint**: `/api/products/{id}`
-   **Method**: `DELETE`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
{
    "message": "Product deleted successfully"
}
```

---

## Deals/Projects Management

### 1. Get All Deals

-   **Endpoint**: `/api/deals`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Query Parameters**:
    -   `status` (optional): `draft|waiting_approval|approved|rejected|closed_won|closed_lost`
-   **Response**:

```json
[
    {
        "id": "string",
        "lead_id": "string",
        "lead_name": "string",
        "total_amount": 500000,
        "status": "waiting_approval",
        "sales_id": "string",
        "approved_by": "string",
        "items": [
            {
                "id": "string",
                "product_id": "string",
                "product_name": "string",
                "quantity": 1,
                "unit_price": 250000,
                "negotiated_price": 230000,
                "subtotal": 230000
            }
        ],
        "created_at": "2025-09-03T00:00:00Z"
    }
]
```

### 2. Create Deal

-   **Endpoint**: `/api/deals`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "lead_id": "string",
    "items": [
        {
            "product_id": "string",
            "quantity": 1,
            "negotiated_price": 230000
        }
    ]
}
```

-   **Response**:

```json
{
    "id": "string",
    "lead_id": "string",
    "total_amount": 230000,
    "status": "draft",
    "needs_approval": true,
    "created_at": "2025-09-03T00:00:00Z"
}
```

### 3. Update Deal Status

-   **Endpoint**: `/api/deals/{id}/status`
-   **Method**: `PUT`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "status": "approved|rejected",
    "notes": "string (optional)"
}
```

### 4. Approve Deal (Manager Only)

-   **Endpoint**: `/api/deals/{id}/approve`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "approved": true,
    "notes": "string (optional)"
}
```

---

## Customers Management

### 1. Get All Active Customers

-   **Endpoint**: `/api/customers`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
[
    {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "address": "string",
        "services": [
            {
                "id": "string",
                "product_name": "Paket Internet 50Mbps",
                "start_date": "2025-01-01",
                "monthly_fee": 250000,
                "status": "active"
            }
        ],
        "created_at": "2025-09-03T00:00:00Z"
    }
]
```

### 2. Get Customer Details

-   **Endpoint**: `/api/customers/{id}`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "services": [
        {
            "id": "string",
            "product_name": "Paket Internet 50Mbps",
            "start_date": "2025-01-01",
            "monthly_fee": 250000,
            "status": "active",
            "deal_id": "string"
        }
    ],
    "total_monthly_revenue": 250000,
    "created_at": "2025-09-03T00:00:00Z"
}
```

---

## Reporting

### 1. Sales Report

-   **Endpoint**: `/api/reports/sales`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Query Parameters**:
    -   `start_date`: YYYY-MM-DD
    -   `end_date`: YYYY-MM-DD
    -   `sales_id` (optional): specific sales person
-   **Response**:

```json
{
    "period": {
        "start_date": "2025-01-01",
        "end_date": "2025-01-31"
    },
    "summary": {
        "total_leads": 50,
        "total_deals": 15,
        "total_customers": 10,
        "total_revenue": 2500000,
        "conversion_rate": 20.0
    },
    "by_sales": [
        {
            "sales_id": "string",
            "sales_name": "string",
            "leads_count": 15,
            "deals_count": 5,
            "customers_count": 3,
            "revenue": 750000
        }
    ]
}
```

### 2. Export Report to Excel

-   **Endpoint**: `/api/reports/export`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Query Parameters**:
    -   `type`: `sales|leads|customers|deals`
    -   `start_date`: YYYY-MM-DD
    -   `end_date`: YYYY-MM-DD
    -   `sales_id` (optional)
-   **Response**: Excel file download

### 3. Dashboard Summary

-   **Endpoint**: `/api/reports/dashboard`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
{
    "leads": {
        "total": 50,
        "new_this_month": 15,
        "by_status": {
            "new": 10,
            "contacted": 15,
            "qualified": 20,
            "closed_won": 5
        }
    },
    "deals": {
        "total": 25,
        "waiting_approval": 5,
        "approved": 15,
        "total_value": 5000000
    },
    "customers": {
        "total": 15,
        "active_services": 18,
        "monthly_recurring_revenue": 3750000
    },
    "recent_activities": [
        {
            "type": "lead_created|deal_approved|customer_added",
            "description": "string",
            "created_at": "2025-09-03T00:00:00Z"
        }
    ]
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
    "message": "Unauthenticated"
}
```

### 403 Forbidden

```json
{
    "message": "Access denied. Insufficient permissions"
}
```

### 422 Validation Error

```json
{
    "message": "The given data was invalid",
    "errors": {
        "email": ["The email field is required"]
    }
}
```

### 404 Not Found

```json
{
    "message": "Resource not found"
}
```

### 500 Server Error

```json
{
    "message": "Internal server error"
}
```

---

## Role-Based Access Control

### Sales Role

-   Can only access their own leads, deals, and customers
-   Cannot approve deals that require manager approval
-   Can create and update leads, products, and deals
-   Can view reports for their own data

### Manager Role

-   Can access all data from all sales personnel
-   Can approve/reject deals
-   Can view comprehensive reports
-   Has full CRUD access to all resources

---

## Notes

1. **Automatic Price Calculation**: Product selling price is automatically calculated as `hpp + (hpp * margin_percentage / 100)`

2. **Approval Workflow**: If negotiated price in a deal is below the product's selling price, the deal status automatically becomes `waiting_approval`

3. **Lead to Customer Conversion**: When a deal is approved and status becomes `closed_won`, the lead automatically converts to a customer

4. **Pagination**: Most list endpoints support pagination with `page` and `per_page` parameters

5. **Filtering**: Endpoints support filtering by date ranges, status, and user roles where applicable
