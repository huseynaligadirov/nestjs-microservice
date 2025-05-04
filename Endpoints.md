# 📘 User Service API Endpoints

## 🔐 Authenticated Endpoints

### POST `/users/login`
**Description:** Logs in a user and returns a JWT token.  
**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "access_token": "jwt_token_here"
}
```

---

## 👤 User Endpoints

### POST `/users/register`
**Description:** Creates a new user.  
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword"
}
```
**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### GET `/users/:id`
**Description:** Returns the user by ID (excluding password).  
**Path Parameter:** `id` – User's UUID  
**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

# 📦 Order Service API Endpoints

## 🔐 Authenticated Endpoints

> All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 📦 Order Endpoints

### POST `/orders`
**Description:** Creates a new order for the authenticated user.  
**Body:**
```json
{
  "title": "Item Name",
  "price": 2,
  "description": "Lorem ipsum"
}
```
**Response:**
```json
{
  "id": "order-id",
  "product": "Item Name",
  "price": 2,
  "description": "Lorem Ipsum",
  "userId": "user-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### GET `/orders`
**Description:** Returns all orders for the currently authenticated user.  
**Response:**
```json
[
  {
  "id": "order-id",
  "product": "Item Name",
  "price": 2,
  "description": "Lorem Ipsum",
  "userId": "user-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z"
},
  ...
]
```