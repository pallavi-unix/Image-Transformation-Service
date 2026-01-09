# Image-Transformation-Service

## Project Overview
A full-stack web application that allows users to upload an image, automatically remove its background, horizontally flip it, and access the processed image via a unique hosted URL.

## Tech Stack
- **Frontend:** Vue 3, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Image Processing:** Third-party background removal API
- **Hosting:** Cloud image hosting service
- **Version Control:** Git & GitHub

# Image-Transformation-Service

## Project Overview
A full-stack web application that allows users to upload an image, automatically remove its background, horizontally flip it, and access the processed image via a unique hosted URL. Users can also copy a shareable link, see confetti animation on successful processing, and auto-scroll to view processed images. This project demonstrates integration of AI-powered image processing with a fun, interactive UI.

## Tech Stack
- **Frontend:** Vue 3, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Image Processing:** Third-party background removal API (e.g., remove.bg or NoBG.link)
- **Hosting:** Vercel (Frontend), Vercel/Render (Backend)
- **Version Control:** Git & GitHub

## Features
- Upload an image
- Remove image background using a third-party API
- Horizontally flip the processed image
- Generate a unique URL for the processed image
- Copy shareable link to clipboard
- Delete uploaded and processed images
- Confetti animation on successful upload
- Auto-scroll to show processed images
- Base64 image display for seamless frontend-backend integration

## Project Structure
Image-Transformation-Service/
│
├─ backend/ # Node.js + Express backend
│ ├─ src/
│ │ ├─ routes/ # API routes
│ │ └─ utils/ # Image processing logic
│ ├─ uploads/ # Uploaded & processed images
│ ├─ package.json
│ └─ tsconfig.json
│
├─ frontend/ # Vue 3 + Vite frontend
│ ├─ src/
│ │ ├─ components/
│ │ │ └─ ImageUpload.vue
│ │ └─ App.vue
│ ├─ package.json
│ └─ vite.config.ts
│
└─ README.md

## How to Run Locally

### Prerequisites
- Node.js v20 or higher
- npm (comes with Node.js)
- Git

## How to Run Locally

### Backend Setup
1. Navigate to backend folder:

### Prerequisites
- Node.js v20 or higher
- npm (comes with Node.js)
- Git

```bash
cd backend
npm install
npm run dev
```
### Frontend Setup
1. Navigate to frontend folder:

```bash
cd frontend
npm install
npm run dev
```
### Deployed both Backend and Frontend on the vercle, they are live now

# ENJOY!
