# ⚙️ CurioCue — Setup Guide

This guide will help you run CurioCue locally with both frontend and backend.

---

## 🧰 Prerequisites

Make sure you have:

* **Node.js** (v16 or above) → https://nodejs.org
* **npm** (comes with Node)
* **Git**

---

## 📥 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CurioCue.git
cd CurioCue
```

---

## 🖥️ 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

👉 Backend will run on:
http://localhost:5000

---

## 💻 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

👉 Frontend will run on:
http://localhost:5173

---

## 🌐 4. Open the Application

Open in browser:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables (Optional but Recommended)

### 📁 Backend `.env`

Create file:

```bash
backend/.env
```

Add:

```env
PORT=5000
NODE_ENV=development

# Optional APIs
TMDB_API_KEY=
GOOGLE_BOOKS_API_KEY=
CLAUDE_API_KEY=
```

---

### 📁 Frontend `.env.local`

Create file:

```bash
frontend/.env.local
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Verify Setup

Check if everything works:

* Home page loads ✅
* Search works ✅
* Cards display properly ✅
* Clicking a title opens details page ✅
* Save / Remove works ✅

---

## ⚠️ Common Issues & Fixes

### ❌ Backend not connecting

✔ Ensure:

* Backend is running on port **5000**
* No typo in API URL
* Vite proxy is configured

---

### ❌ Blank screen

✔ Run:

```bash
npm run dev
```

---

### ❌ API errors

✔ Check:

* `.env` file exists
* API keys (if used) are correct

---

## 📦 Production Build

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

---

### Backend

```bash
cd backend
npm start
```

---

## 🚀 Deployment (Optional)

You can deploy:

* **Frontend** → Vercel / Netlify
* **Backend** → Railway / Render / Vercel

---

## 🎯 You're Ready

If everything is running:

👉 Your project is ready for:

* Demo
* Viva
* Submission
* Deployment

---

💡 Tip: Keep backend and frontend running in separate terminals during development.
