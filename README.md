# GeoJob India 🗺️💼

GeoJob India is a premium, dark-mode-first data lake and job aggregator designed specifically for B.Tech CSE graduates (Software Engineers, Full-Stack, Frontend, Backend, etc.). It visualizes thousands of job opportunities across India's top tech hubs using an interactive Google Maps interface.

## 🚀 Features
- **Geospatial Visualization:** Plot software engineering jobs on an interactive map.
- **Automated Data Ingestion:** Includes an automated daily CRON job pulling live fresher roles from the Adzuna API.
- **Dynamic Filtering:** Instantly filter jobs by Tech Stack, Role Type, and Experience Level (e.g., 0 for Freshers).
- **Sort by Date:** Toggle between Newest First and Oldest First job postings.
- **Premium Dark Mode UI:** Built with Tailwind CSS v4 featuring glassmorphism and modern design aesthetics.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS v4, Lucide React, `@react-google-maps/api`
- **Backend:** Node.js, Express.js, Mongoose, Node-Cron, Axios
- **Database:** MongoDB (utilizing `2dsphere` geospatial indexing and Text indexing)

## 📂 Project Structure
This is a monorepo setup:
- `/client` - Contains the React Vite frontend.
- `/server` - Contains the Express backend and data ingestion pipeline.

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/geojob_india
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
```

Run the backend:
```bash
npm run dev # or node server.js
```
*(Note: Once the server connects to MongoDB, a CRON job will automatically schedule daily data ingestion at midnight).*

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `/client` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Run the frontend:
```bash
npm run dev
```

### 4. (Optional) Run Manual Data Ingestion
To immediately populate your local database with real fresher jobs, run:
```bash
cd server
node utils/dataIngestion.js
```
