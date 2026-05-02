# 🚀 Real-Time Checkboxes System

A scalable, real-time web application inspired by the “1 Million Checkboxes” concept. This system allows multiple authenticated users to interact with a massive grid of checkboxes, with updates synchronized instantly across all connected clients using WebSockets and Redis.

---

## 📌 Project Overview

This project demonstrates real-time communication, distributed system design, and backend scalability using **Node.js, WebSockets, and Redis**.

The application is designed to handle a large number of checkboxes efficiently while ensuring:

- Low latency updates
- Consistent shared state
- Abuse prevention via rate limiting
- Secure user authentication

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Real-Time Communication
- WebSockets (Socket.IO)

### Data Layer
- Redis (Bitmap + Pub/Sub)

### Authentication
- OAuth 2.0 / OIDC (Google OAuth using Passport.js)

---

## ✨ Features

- 🔄 Real-time checkbox synchronization across all users
- 🔐 OAuth-based authentication (only logged-in users can modify state)
- ⚡ Redis Bitmap for memory-efficient storage of large checkbox grid
- 📡 Redis Pub/Sub for multi-server synchronization
- 🚫 Custom rate limiting (no external libraries used)
- 👥 Proper socket connection and user session handling
- 🧱 Clean and modular backend architecture
- 🎨 Responsive and optimized frontend rendering

---

## 🧠 System Architecture

## 🧠 System Architecture

```text
Client (Browser)
      ↓
WebSocket Connection (Socket.IO)
      ↓
Node.js + Express Server
      ↓
Redis
 ├── Bitmap (Checkbox State)
 ├── Pub/Sub (Real-time Sync)
 └── Rate Limiting (Counters)

---
```

## ⚙️ How It Works

### 1. Checkbox State Management

- All checkboxes are stored using a **Redis Bitmap**
- Each checkbox index represents a bit

Example:
```bash
SETBIT checkboxes 100 1
GETBIT checkboxes 100
```
✔ Efficient for handling millions of checkboxes
✔ Minimal memory usage

### 2. Real-Time Update Flow

- User toggles checkbox
- Frontend emits event via WebSocket
- Backend:
  - Validates authentication
  - Applies rate limiting
  - Updates Redis
  - Publishes event
- All clients receive update instantly

### 3. Redis Pub/Sub (Scaling)

Used to sync updates across multiple backend instances and ensures consistency in distributed environments.

### 4. Authentication Flow

- OAuth 2.0 login (Google)
- Session stored using Express session
- Socket connections validated using session

✔ Only authenticated users can toggle checkboxes
✔ Anonymous users get read-only access

### 5. Custom Rate Limiting Logic

Implemented manually using Redis:

Each user/socket has a key
Counter + expiry used for time window control

Example:
```bash
INCR rate:userId
EXPIRE rate:userId 5
```

✔ Prevents spam clicking
✔ Works for both HTTP & WebSocket

### 6. Edge Case Handling

- Multiple users toggling same checkbox → handled via Redis atomic ops
- Page refresh → full state fetched from Redis
- Socket disconnect/reconnect handled gracefully
- Spam clicks → blocked via rate limiting

### 7. Frontend Optimization

- Avoid rendering all checkboxes at once
- Use virtualization / batching
- Efficient DOM updates on state change

---

## 🚀 Local Setup & Installation

### Prerequisites

- Node.js (v18+)
- Redis server running locally
- OAuth credentials

### 1. Clone Repository

```bash
git clone https://github.com/peeyushtiwari888/1M-CHECKBOX-PROJECT.git
cd 1M-CHECKBOX-PROJECT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file with:

```env
PORT=8000
SESSION_SECRET=your_secret
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
REDIS_URL=redis://localhost:6379
```

### 4. Start Redis

```bash
redis-server
```

### 5. Run Application

```bash
npm run dev
```

### 6. Open in Browser

http://localhost:8000

---

## 📡 WebSocket Events

| Event | Description |
|---|---|
| `toggle` | Client requests checkbox toggle |
| `update` | Server broadcasts checkbox update |
| `error` | Rate limit / auth errors |

---

## 📁 Project Structure

```
project/
│
├── client/
├── server/
│   ├── sockets/
│   ├── redis/
│   ├── auth/
│   ├── rateLimiter/
│   └── routes/
│
├── .env.example
└── README.md
```

---

## 🎥 Demo Video

👉 Add your unlisted YouTube link here

## 🌐 Live Demo

👉 Add deployed link here (if available)

## 📸 Screenshots

👉 Add UI screenshots here

---

## 📌 Submission Links

- 🔗 GitHub Repo: https://github.com/peeyushtiwari888/1M-CHECKBOX-PROJECT
- 🎥 Demo Video: Add YouTube link
- 🌐 Live Project: Add link

## 👨‍💻 Author

Peeyush Tiwari

---

## Next Upgrade Ideas

- 🔥 Badges (build, tech stack, stars)
- 📊 Architecture diagram image
- 🎬 YouTube demo script (perfect explanation flow)
