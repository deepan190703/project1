# Excel Analytics Platform - Setup Instructions

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd excel-analytics-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/excel-analytics
   JWT_SECRET=your-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd excel-analytics-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google Gemini API key (optional for AI features)

## Features

- ✅ User authentication (JWT-based)
- ✅ Excel file upload and parsing
- ✅ Interactive chart generation (2D and 3D)
- ✅ AI-powered data insights
- ✅ Admin dashboard
- ✅ Chart export (PNG/PDF)
- ✅ Responsive design

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Google Gemini API integration
- Multer for file uploads
- XLSX for Excel parsing

### Frontend
- React.js + Vite
- Redux Toolkit
- Chart.js for 2D charts
- Three.js for 3D visualizations
- Tailwind CSS
- React Router
- Axios for API calls

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/files/upload` - Upload Excel file
- `GET /api/files/history` - Get user's upload history
- `GET /api/files/:id` - Get specific analysis data
- `POST /api/files/:id/chart` - Create chart from analysis
- `POST /api/files/:id/ai-summary` - Generate AI insights
- `GET /api/admin/stats` - Admin statistics
- `GET /api/admin/users` - Admin user management

## Default Admin User

After first run, you can manually create an admin user in MongoDB or register a user and update their role to 'admin' in the database.

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your-jwt-secret-key
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
```

### Frontend
No additional environment variables needed for development.

## Development Commands

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Production Deployment

### Backend
1. Set up MongoDB (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to platforms like Render, Railway, or Heroku

### Frontend
1. Build the project: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License