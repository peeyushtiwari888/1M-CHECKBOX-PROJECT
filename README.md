# Real-Time Checkboxes

A scalable, real-time web application featuring a large grid of checkboxes. This project allows multiple users to connect simultaneously and toggle checkboxes, with state updates broadcasted instantly to all connected clients. It includes robust authentication and security measures to prevent abuse.

## ✨ Features

*   **Real-time Synchronization:** Checkbox state is synced across all connected clients instantly using WebSockets.
*   **Google OAuth Authentication:** Users must log in via Google to modify the grid, ensuring accountability.
*   **Secure WebSockets:** Socket connections are secured and validated against the Express session; unauthenticated attempts are rejected at the protocol level.
*   **Rate Limiting:** Built-in rate limiting per socket connection (1 toggle every 5 seconds) to prevent abuse and spam.
*   **Modern UI:** A beautiful, responsive, dark-themed UI with glassmorphism effects, smooth animations, and toast notifications.

## 🛠 Tech Stack

*   **Frontend:** Vanilla HTML, CSS, JavaScript
*   **Backend:** Node.js, Express.js
*   **Real-time Engine:** Socket.IO
*   **Authentication:** Passport.js (Google OAuth 2.0), express-session

## 🚀 Local Setup & Installation

### Prerequisites

*   Node.js (v18 or higher recommended)
*   A package manager like `npm` or `pnpm`
*   A Google Cloud account to create OAuth credentials.

### Installation Steps

1.  **Clone the repository and navigate into the directory:**
    ```bash
    # (If cloning from git)
    # git clone <your-repo-url>
    cd CHECKBOXES\ PROJECT
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or using pnpm
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Copy the `.env.example` file to create your own `.env` file:
    ```bash
    cp .env.example .env
    ```
    
    Open the `.env` file and fill in your Google OAuth credentials:
    ```env
    OAUTH_CLIENT_ID=your_google_client_id_here
    OAUTH_CLIENT_SECRET=your_google_client_secret_here
    SESSION_SECRET=a_random_secure_string
    PORT=8000
    ```

### Obtaining Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** > **OAuth client ID**.
5. Choose **Web application** as the application type.
6. Under **Authorized redirect URIs**, add exactly: `http://localhost:8000/auth/google/callback`
7. Click Create, and copy your Client ID and Client Secret into your `.env` file.

## 🏃 Running the Application

Start the development server:

```bash
npm run dev
# or
node index.js
```

Open your browser and navigate strictly to `http://localhost:8000`. 
*(Note: Do not use 127.0.0.1 or an external Live Server extension, as this will break the OAuth callback and WebSocket connections).*

## 🛡 Architecture & Security Details

*   **Socket.IO with Express Sessions:** The application shares the session middleware between Express and Socket.IO. When a client emits a `client:checkbox:change` event, the server verifies `socket.request.session.passport.user` before processing the request.
*   **Custom Rate Limiting:** A `Map` is used to track the `lastOperationTime` for every connected socket ID. If a user tries to toggle a checkbox before the 5-second cooldown expires, the server drops the request and emits a `server:error` back to the client, triggering a UI toast notification.
