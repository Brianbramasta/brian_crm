Siap, saya buatkan versi **API Contract** dalam format **Markdown (.md)** untuk project _Task Management_ dan _Product Store Page_ Anda.

---

````markdown
# API Contract

## Overview

Dokumentasi API untuk aplikasi **Task Management** dan **Product Store Page**.  
Semua response menggunakan format JSON dengan standar HTTP status code.

---

## Authentication

-   **Endpoint**: `/api/auth/login`
-   **Method**: `POST`
-   **Request Body**:

```json
{
    "email": "manager@ptsmart.com",
    "password": "password123"
}
```
````

-   **Response**:

```json
{
    "token": "jwt_token",
    "user": {
        "id": "string",
        "email": "string"
    }
}
```

---

## Task Management

### 1. Get All Tasks

-   **Endpoint**: `/api/tasks`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
[
    {
        "id": "string",
        "title": "string",
        "isCompleted": false,
        "createdAt": "2025-09-03T00:00:00Z"
    }
]
```

### 2. Create Task

-   **Endpoint**: `/api/tasks`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "title": "string"
}
```

-   **Response**:

```json
{
    "id": "string",
    "title": "string",
    "isCompleted": false,
    "createdAt": "2025-09-03T00:00:00Z"
}
```

### 3. Update Task

-   **Endpoint**: `/api/tasks/{id}`
-   **Method**: `PUT`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "title": "string",
    "isCompleted": true
}
```

-   **Response**:

```json
{
    "id": "string",
    "title": "string",
    "isCompleted": true,
    "updatedAt": "2025-09-03T00:00:00Z"
}
```

### 4. Delete Task

-   **Endpoint**: `/api/tasks/{id}`
-   **Method**: `DELETE`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
{
    "message": "Task deleted successfully"
}
```

---

## Product Store Page

### 1. Get All Products

-   **Endpoint**: `/api/products`
-   **Method**: `GET`
-   **Response**:

```json
[
    {
        "id": "string",
        "name": "string",
        "price": 100000,
        "stock": 50,
        "description": "string"
    }
]
```

### 2. Get Product by ID

-   **Endpoint**: `/api/products/{id}`
-   **Method**: `GET`
-   **Response**:

```json
{
    "id": "string",
    "name": "string",
    "price": 100000,
    "stock": 50,
    "description": "string"
}
```

### 3. Add to Cart

-   **Endpoint**: `/api/cart`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <token>`
-   **Request Body**:

```json
{
    "productId": "string",
    "quantity": 2
}
```

-   **Response**:

```json
{
    "id": "string",
    "productId": "string",
    "quantity": 2,
    "addedAt": "2025-09-03T00:00:00Z"
}
```

### 4. Get Cart

-   **Endpoint**: `/api/cart`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
[
    {
        "id": "string",
        "product": {
            "id": "string",
            "name": "string",
            "price": 100000
        },
        "quantity": 2
    }
]
```

### 5. Remove from Cart

-   **Endpoint**: `/api/cart/{id}`
-   **Method**: `DELETE`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:

```json
{
    "message": "Item removed from cart"
}
```

---

```

---
```
