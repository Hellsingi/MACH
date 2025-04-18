# 🏗️ User Profile Microservice Architecture

---

## 📘 Resource Definition: User Profile

The User Profile microservice manages the following fields:

### 👤 User Profile Resource

| Field        | Type      | Description                     |
| ------------ | --------- | ------------------------------- |
| `id`         | UUID      | Unique identifier (primary key) |
| `name`       | String    | Full name of the user           |
| `email`      | String    | Unique email address            |
| `age`        | Integer   | Age of the user                 |
| `created_at` | Timestamp | Timestamp of creation           |
| `updated_at` | Timestamp | Timestamp of last update        |

---

## 🧱 Architectural Diagram: MACH-Based Design

```
┌───────────────────────────────────────────────────────────────────────┐
│                      MACH Architecture                                │
└───────────────────────────────────────────────────────────────────────┘
                                │
┌───────────────────────────────────────────────────────────────────────┐
│                     Client Applications                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  Web Client  │  │ Mobile App   │  │   IoT        │  │ Partner  │  │
│  │              │  │              │  │  Devices     │  │   API    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────┬─────────────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────────────┐
│                       API Gateway                                     │
│                                                                       │
│   ┌───────────────────────────────────────────────────────────────┐   │
│   │   Authentication   │   Rate Limiting   │    Load Balancing    │   │
│   └───────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬─────────────────────────────────────────┘
                              │
        ┌───────────────────┬─┴───────────┬───────────────┐
        │                   │             │               │
┌───────▼───────┐   ┌───────▼───────┐   ┌─▼─────────┐   ┌─▼────────────┐
│   User Profile │   │   Product     │   │ Order     │   │ Notification │
│   Microservice │   │  Microservice │   │Microservice│   │ Microservice │
│                │   │               │   │           │   │              │
└───────┬───────┘   └───────────────┘   └───────────┘   └──────────────┘
        │
        │
┌───────▼───────┐
│  User Profile  │
│   Database     │
└───────────────┘
```

---

## 🧩 Internal Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 User Profile Microservice                   │
│                                                             │
│  ┌────────────┐   ┌────────────┐   ┌────────────────────┐   │
│  │ REST API   │──▶│ Profile     │──▶ Data Access Layer   │   │
│  │            │   │ Service     │   │                    │   │
│  └────────────┘   └────┬───────┘   └────────┬───────────┘   │
│                        │                   │               │
│                   ┌────▼───────────────────▼────┐          │
│                   │    Validation & Business    │          │
│                   │           Logic             │          │
│                   └─────────────────────────────┘          │
└────────────────────────────┬───────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  PostgreSQL DB  │
                    └─────────────────┘
```

---

## 🌐 API Endpoints

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | `/api/users`     | Create a new user profile       |
| GET    | `/api/users`     | Get all users (with pagination) |
| GET    | `/api/users/:id` | Get specific user profile       |
| PUT    | `/api/users/:id` | Update user profile completely  |
| DELETE | `/api/users/:id` | Delete a user profile           |

---

## 🔁 Interactions with Other Microservices

### 🔐 Authentication Service

- Verifies user credentials during login
- Provides tokens for authorized profile access

### 📦 Order Service

- Retrieves user shipping address for order fulfillment
- Updates user’s purchase history

### 🛒 Product Service

- Gets user preferences to recommend products
- Tracks product interactions to update preferences

### 📬 Notification Service

- Sends profile update confirmations
- Delivers personalized notifications

---

## ✅ Key Features

- **Data Validation**: Strong validation for fields (e.g., email format, required fields)
- **Security**: User data encrypted at rest and in transit
- **Scalability**: Designed for millions of users with proper indexing
- **Resilience**: Circuit breakers for dependent services
- **Observability**: Logging and monitoring support
- **GDPR Compliance**: Supports data export and deletion
