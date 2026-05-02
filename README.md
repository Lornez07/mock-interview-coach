# AI Mock Interview Coach 🚀

A full-stack, AI-powered application designed to help job seekers practice their interview skills. Users can select specific job roles, answer AI-generated questions, and receive instant, detailed feedback and scoring—all powered by Google's Gemini AI.

![License](https://img.shields.io/github/license/Lornez07/mock-interview-coach)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

## ✨ Features

- **🎯 Role-Specific Practice**: Generate interview questions tailored to any job role (e.g., Frontend Developer, Project Manager, Data Scientist).
- **🤖 AI-Powered Evaluation**: Receive instant scoring (1-10) and qualitative feedback for every answer using Google Gemini 2.0 Flash.
- **🔐 Secure Authentication**: Full user registration and login system using JWT (JSON Web Tokens).
- **📊 History Tracking**: View all past interview sessions, questions, and feedback in a persistent dashboard.
- **📱 Responsive Design**: Fully mobile-responsive UI built with Tailwind CSS v4 and modern glassmorphism aesthetics.
- **⚡ Fast & Modern**: Built with Vite for near-instant development and optimized production builds.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Axios, React Router v6.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (with Mongoose).
- **AI Engine**: Google Gemini API (Free Tier).
- **Deployment**: Vercel (Frontend) & Render (Backend).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A MongoDB Atlas Cluster
- A Google AI Studio API Key ([Get one for free here](https://aistudio.google.com/))

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lornez07/mock-interview-coach.git
   cd mock-interview-coach
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` folder:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the application**
   - Start Backend: `cd server && npm run dev`
   - Start Frontend: `cd client && npm run dev`

## 📦 Deployment

### Backend (Render/Railway)
- Set `NODE_ENV` to `production`.
- Ensure all environment variables from the server `.env` are added to the deployment platform.
- Update the `CLIENT_URL` in the backend CORS settings to match your frontend domain.

### Frontend (Vercel/Netlify)
- Set `VITE_API_URL` to your live backend URL (e.g., `https://your-api.onrender.com/api`).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by [Lornez](https://github.com/Lornez07)
