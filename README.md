# YouApp Backend

This is the backend service for **YouApp**, built with **NestJS**, **MongoDB**, **RabbitMQ**, and **Docker**.

---

## 🚀 Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 recommended)
- **npm**
- **Docker**
- **Docker Compose**

---

## 📦 Installation & Running the App

Follow these steps **in order**.

---

### 1️⃣ Create `.env` File

Create a file named **`.env`** in the project root and fill it with the following example:

```env
# App
APP_PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://mongo:27017/youapp

# JWT
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1d

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_QUEUE=chat_messages
```

> ⚠️ **Do not commit `.env` to GitHub** — it is already ignored by `.gitignore`.

---

### 2️⃣ Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

---

### 3️⃣ Build & Run the App with Docker

Build and start all services (API, MongoDB, RabbitMQ):

```bash
docker compose up --build
```

The API will be available at:

```
http://localhost:3000
```

---

### 4️⃣ API Documentation

You can test the API using **Swagger** or **Postman**.

#### 🔹 Swagger UI
```
http://localhost:3000/api/docs
```

#### 🔹 Postman
Import the Postman collection file located at:

```
YouApp Backend Test.postman_collection.json
```

(from the root project directory)

---

## 📂 File Uploads

Uploaded profile images are stored locally at:

```
uploads/profile
```

---

## 🧪 Development Notes

- Authentication uses **JWT Bearer Token**
- API routes are prefixed with `/api`
- Supports `multipart/form-data` for profile image uploads

---

## 🛠 Tech Stack

- **NestJS**
- **MongoDB + Mongoose**
- **RabbitMQ**
- **Swagger (OpenAPI)**
- **Docker & Docker Compose**

---

## 📄 License

This project is for internal / assessment purposes.
