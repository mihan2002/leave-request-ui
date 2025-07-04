# 📝 Leave Request Application

This is a full-stack **Leave Request Management** system built with a **React (Vite)** frontend and a **Spring Boot** backend. The backend uses **PostgreSQL** for data storage and implements **JWT-based authentication and authorization**.

This document contains frontend setup instructions only.

---

## 🔧 Tech Stack

- React (Vite)
- React Router
- Axios
- RxJS
- React Matirial UI
- Tailwind CSS
- JWT Authentication

## 📁 Project Structure

Located inside the `/leave-request-ui` folder:

The application includes

- `Login`, `Signup`, `LeaveForm`, and `LeaveList` components.
- HTTP interceptor for JWT authentication.
- RxJS Subjects for cross-component communication.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mihan2002/leave-request-ui.git
```

### 2. Configure the enviroment

Change the directory to `leave-request-ui`.

```bash
  cd leave-request-ui
```

Create a .env file in the root of the frontend folder (leave-request-ui):

Add this line to the .env file and save.

```bash
  VITE_APP_API_BASE=http://localhost:8080/
```

### 3. Run the frontend

Open a command window and change directory to the `leave-request-ui` folder and run the below commands.

```bash
  npm install
  npm run dev
```

### 4. Backend setup (Optional)
 If you haven't already setup the backend application, please use the below link to setup the backend application.
```bash
  https://github.com/mihan2002/leave-request-api.git
```
