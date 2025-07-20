# 💬 MERN Chat App


A real-time chat application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) using **Socket.IO** for real-time communication and **Multer** for file uploads.

---

## ✨ Features

- ✅ Real-time messaging using WebSockets
- ✅ Upload and share files (images, PDFs, etc.)
- ✅ Sent messages and files are shown with timestamps
- ✅ Responsive UI using Tailwind CSS
- ✅ Clean separation of `client` and `server` folders

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/7430ccd9-085c-4064-899c-d30d572183ca)
![image](https://github.com/user-attachments/assets/23408c25-c3c3-4393-bd0c-50b6d54f3dd3)

---

## 📁 Folder Structure

```markdown
mern-chat-app/
├── client/                   # React frontend
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── .prettierrc
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
│
├── server/                  # Node.js backend
│   ├── node_modules/
│   ├── src/
│   │   ├── uploads/         # Uploaded files stored here
│   │   └── index.js         # Express + Socket.IO server
│   ├── .gitignore
│   ├── .prettierrc
│   ├── package.json
│   └── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

---

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/MaulikGupta27/mern-chat-app.git
cd mern-chat-app
```

---

#### 2. Start the Backend Server

> 📁 **Before starting the backend**, create the `uploads` folder where Multer will store uploaded files:

```bash
mkdir server/src/uploads
```

⚠️ This folder is **not auto-created** by the server — if it’s missing, file uploads will fail.

```bash
cd server
npm install
npm run dev
```

Runs the Express + Socket.IO server at `http://localhost:3000`.

---

#### 3. Start the React Client

> 📌 **Important:** Keep the backend running in its terminal.  
> Now, **open a new terminal window/tab**.

Then run:

```bash
cd mern-chat-app/client
npm install
npm run dev
```

Runs the Vite React app at `http://localhost:5173`.

---

## 🛠️ Tech Stack

### Frontend:
- **React**
- **Vite**
- **Tailwind CSS**
- **Socket.IO Client**

### Backend:
- **Node.js**
- **Express.js**
- **Multer**
- **Socket.IO Server**
