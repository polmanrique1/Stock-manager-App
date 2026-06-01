<div align="center">

# 📦 Stock Management API

**A robust Java Spring Boot REST API for multi-warehouse inventory control**

---

## 📋 Description

This application is a **Java Spring Boot REST API** designed for stock management across multiple warehouses. It allows you to:

- ✅ Manage product stock across **multiple warehouses**
- ✅ Create **orders** to transfer, add, or sell stock
- ✅ Secure access via **JWT authentication**
- ✅ Generate **PDF reports** of movements and orders
- ✅ Load **fake data** instantly for testing purposes

---

## 🛠️ Technologies

### Backend
| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 3.x |
| H2 Database | In-memory |
| Spring Security | — |
| JPA / Hibernate | — |
| JWT | — |

### Frontend
| Technology | Purpose |
|---|---|
| React | UI framework |
| Tailwind CSS | Styling |

> **Note:** The core of this project is the **backend**. The frontend serves as a convenient interface for interacting with the API. Frontend styles were developed with AI assistance for faster, polished design.

---

## 🗂️ Project Structure

### Backend Architecture

The backend follows a clean **layered architecture**:

```
src/
├── controllers/       # Endpoint definitions, delegate to services
├── services/          # Core business logic & validation
├── repositories/      # Data access layer
├── models/            # Entity classes
├── dtos/              # Data Transfer Objects
├── config/            # App & security configuration
└── exceptions/        # Custom exception handling
```

### Frontend Architecture

```
src/
├── components/
│   ├── dashboard/        # Main dashboard views
│   └── subComponents/    # Reusable UI elements
```

---

## 🔐 Authentication

Authentication is handled via **JWT (JSON Web Tokens)**. To get started:

1. **Register** with your email, username, and password → receive a JWT
2. **Include the token** in the `Authorization` header for all subsequent requests

> ⚠️ There are no roles implemented. All authenticated users have full access.

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/auth/register` | Create a new user account | ❌ |
| `POST` | `/auth/login` | Login and receive a JWT | ❌ |
| `GET` | `/auth/me` | Get logged-in user data | ✅ |

**Example — Authorization header:**
```http
Authorization: Bearer <your_jwt_token>
```

---

## ⚙️ Core Logic

### Service Layer

All business logic lives in the **service layer**. Controllers act purely as routing delegates, calling service methods and exposing endpoints. Every incoming request is validated in the service layer to prevent errors from unexpected or malformed inputs.

### 🔒 Transactions & Locking

| Feature | Implementation |
|---|---|
| **Data consistency** | `@Transactional` on all data-modifying methods — full rollback on error |
| **Race condition prevention** | **Pessimistic locking** on movement-related operations |
| **Deadlock prevention** | Data is ordered before execution |

### 📄 PDF Generation

Two dedicated methods generate PDFs containing lists of **movements** and **orders**, which are sent directly to the frontend for download.

---

## 🗃️ Entities

The project contains **7 entities**:

| Entity | Persisted | Description |
|--------|:---------:|-------------|
| `Product` | ✅ | Represents a product |
| `Warehouse` | ✅ | A physical or logical warehouse |
| `Order` | ✅ | A collection of movements |
| `Movement` | ✅ | A stock operation (transfer, add, sell) |
| `MovementData` | ❌ | Temporary movement data within an order |
| `User` | ✅ | Application user |
| `Inventory` | ✅ | Stock levels per product per warehouse |

> `MovementData` is not persisted — it temporarily holds movement information to allow the creation of provisional movements inside an order before committing.



---

## 🧪 Fake Data Loading

Since the database is **in-memory (H2)**, a helper endpoint is provided to quickly populate the database with fake data for testing.

```http
POST http://localhost:8080/fake-data/load
```

> JWT is required. This seeds all entities with sample data.

---

## 🚀 Running the Project

### Prerequisites

| Tool | Required Version |
|------|-----------------|
| Java | 21+ |
| Maven | Bundled (`mvnw`) |
| Node.js | Latest LTS |

---

### Backend

 Open the project in your preferred IDE (**IntelliJ IDEA**, **Eclipse**, **VS Code**) and run the main `Application` class.

> Spring Boot version: **4.0.6**  
> The H2 console is available at: `http://localhost:8080/h2-console`

---

### Frontend

```bash
npm install
npm run dev
```

The frontend will start at `http://localhost:5173` by default.



---

<div align="center">

Made with ☕ and Spring Boot

</div>
