# 🤩 User Profile Microservice (MACH Architecture)

This microservice manages **user profiles** as part of a modular architecture that follows MACH principles (Microservices, API-first, Cloud-native, Headless).

---

## 🚀 Tech Stack

- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** PostgreSQL (via Docker)
- **Validation:** Joi
- **Containerization:** Docker + Docker Compose

---

## 📦 Features

- Create, read, update, delete user profiles
- Input validation with Joi
- RESTful API structure
- PostgreSQL with persistent volumes
- Cloud-ready with Docker

---

## ⚙️ How to Run Locally

1. **Clone the repo:**

```bash
git clone https://github.com/Hellsingi/MACH.git
cd MACH
git checkout feat_user_profile
```

2. **Create `.env` file:**

You can copy the example file:

```bash
cp .env.example .env
```

3. **Start PostgreSQL with Docker:**

```bash
docker-compose up -d
```

4. **Install dependencies and run the app:**

```bash
npm install
npm run dev
```

App will be available at: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/api/users`     | Create new user    |
| GET    | `/api/users`     | Retrieve all users |
| PUT    | `/api/users/:id` | Update user by ID  |
| DELETE | `/api/users/:id` | Delete user by ID  |

---

## ✅ MACH Architecture Alignment

- **Microservices**: Runs as an independent, self-contained service.
- **API-first**: Provides a well-structured REST API.
- **Cloud-native**: Dockerized for easy cloud deployment.
- **Headless**: No UI; serves data over HTTP API.

---

## 🧑‍💻 Author

Made by [@Hellsingi](https://github.com/Hellsingi) for microservice architecture practice.
