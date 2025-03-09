
# Real-Time Chat Application

A simplified, real-time chat application where multiple users can instantly send and receive messages within a single chat room, demonstrating WebSocket communication between a React/TypeScript frontend and a Python FastAPI backend.

## Project Structure

```
.
├── frontend/         # React/TypeScript frontend code
├── backend/          # Python FastAPI backend code
└── README.md         # This file
```

## Features

- Real-time messaging using WebSockets
- Visual connection status indicator
- Responsive design for various screen sizes
- Message broadcasting to all connected clients
- Automatic reconnection attempts

## Requirements

### Frontend
- Node.js (>= 14.x)
- npm or yarn

### Backend
- Python (>= 3.8)
- FastAPI
- Uvicorn
- Websockets

## Setup and Running

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following content:
   ```
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Testing

### Backend Tests

1. Make sure you are in the backend directory with the virtual environment activated
2. Run the tests:
   ```
   pytest
   ```

### Frontend Tests

1. Make sure you are in the frontend directory
2. Run the tests:
   ```
   npm test
   ```

## Assumptions

- The application runs in a single chat room where all messages are broadcasted to all connected clients
- No message persistence (messages are not stored after server restart)
- No user authentication or identification beyond randomly generated IDs
- The backend runs on localhost:8000 and the frontend on localhost:3000

## Deployment (Optional)

### Backend Deployment

The backend can be deployed to platforms like Heroku, DigitalOcean, or AWS:

1. Make sure you have the necessary production configurations
2. For Heroku, add a Procfile:
   ```
   web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-8000}
   ```

### Frontend Deployment

The frontend can be deployed to platforms like Vercel, Netlify, or GitHub Pages:

1. Build the production version:
   ```
   npm run build
   ```
2. Deploy the output from the build directory
3. Make sure to update the `NEXT_PUBLIC_WS_URL` environment variable to point to your deployed backend
