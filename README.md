# Image-Transformation-Service

## Project Overview
A full-stack web application that allows users to upload an image, automatically remove its background, horizontally flip it, and access the processed image via a unique hosted URL.

## Tech Stack
- **Frontend:** Vue 3, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Image Processing:** Third-party background removal API
- **Hosting:** Cloud image hosting service
- **Version Control:** Git & GitHub

### Features
- Upload an image
- Remove image background using a third-party API
- Horizontally flip the processed image (upcoming)
- Generate a unique URL for the processed image
- Delete uploaded and processed images

## How to Run Locally

### Prerequisites
- Node.js v20 or higher
- npm (comes with Node.js)
- Git

### Backend Setup

### Upload and Process Image
1. Start backend: `npm run dev`
2. Send a POST request to `/api/images/upload` with key `image` (File)
3. Response contains:
   - `original`: path to original image
   - `processed`: path to background-removed image
4. Access images via: `http://localhost:5000/uploads/<filename>`
