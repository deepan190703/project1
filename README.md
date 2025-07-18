# Excel Analytics Platform

A powerful platform for uploading Excel files, analyzing data, and generating interactive 2D and 3D charts with AI-powered insights. Built with the MERN stack for a complete full-stack experience.

## 🚀 Live Application Screenshots

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/0c4cf700-5642-4839-abe0-868bead4adc7)

### Authentication System
![Login Page](https://github.com/user-attachments/assets/ee85954d-ab87-459f-9df9-e5d99f8dcad9)
![Register Page](https://github.com/user-attachments/assets/2f2448ea-35d5-430d-b746-59dd03b91ae2)

## ✨ Features

### Core Features
- **📊 Excel File Upload**: Upload any Excel file (.xls or .xlsx) with drag-and-drop interface
- **📈 Interactive Charts**: Generate 2D and 3D charts (bar, line, pie, scatter, 3D column)
- **🎯 Dynamic Axis Selection**: Choose X and Y axes from Excel column headers
- **🤖 AI-Powered Insights**: Google Gemini API integration for smart data analysis
- **📋 User Dashboard**: Track upload history and manage analyses
- **👑 Admin Panel**: User management and system statistics
- **💾 Chart Export**: Download charts as PNG/PDF files
- **📱 Responsive Design**: Modern UI that works on all devices

### Technical Features
- **🔐 JWT Authentication**: Secure user login and registration
- **🗄️ Data Persistence**: MongoDB storage for user data and analyses
- **⚡ Real-time Updates**: Charts update dynamically as you select different axes
- **📤 File Processing**: Robust Excel parsing with SheetJS
- **🎨 Modern UI**: Clean, intuitive interface built with React

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library with hooks
- **Redux Toolkit** - State management
- **Chart.js** - 2D data visualization
- **Three.js** - 3D visualizations
- **React Router** - Navigation
- **Vite** - Fast development build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Multer** - File upload handling
- **XLSX** - Excel file parsing

### AI & External Services
- **Google Gemini API** - AI-powered data insights
- **Puppeteer** - Chart export functionality
- **Sharp** - Image processing

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Google Gemini API key** (optional for AI features)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/deepan190703/project1.git
cd project1
```

### 2. Backend Setup
```bash
cd excel-analytics-backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your-secure-jwt-secret-key
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
EOF

# Start backend server
npm start
```

### 3. Frontend Setup
```bash
cd ../excel-analytics-frontend
npm install

# Start frontend development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📊 Project Structure

```
project1/
├── excel-analytics-backend/
│   ├── models/
│   │   ├── Analysis.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── files.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── excel-analytics-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── ChartBuilder.jsx
│   │   │   └── Chart3D.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── authSlice.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── README.md
└── SETUP.md
```

## 🎯 Key Features Implemented

### Week 1-2: Foundation & Core Features
- [x] **User Authentication**: JWT-based login and registration
- [x] **Dashboard Layout**: Modern, responsive interface
- [x] **File Upload**: Excel file processing with SheetJS
- [x] **Data Storage**: MongoDB integration for persistent storage

### Week 3-4: Advanced Visualization
- [x] **Chart Generation**: Chart.js for 2D visualizations
- [x] **3D Charts**: Three.js integration for 3D column charts
- [x] **Dynamic Axis Selection**: Real-time chart updates
- [x] **Chart Export**: PNG/PDF download functionality

### Week 5: AI & Polish
- [x] **AI Integration**: Google Gemini API for data insights
- [x] **Admin Dashboard**: User management and statistics
- [x] **Analysis History**: Track and reload previous analyses
- [x] **Production Ready**: Optimized build and deployment

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### File Operations
- `POST /api/files/upload` - Upload Excel file
- `GET /api/files/history` - Get user's upload history
- `GET /api/files/:id` - Get specific analysis data
- `POST /api/files/:id/chart` - Create chart from analysis
- `POST /api/files/:id/ai-summary` - Generate AI insights
- `GET /api/files/:id/download/:format` - Download chart

### Admin Operations
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `PATCH /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Usage Guide

### For Regular Users
1. **Sign Up**: Create an account with email and password
2. **Upload File**: Drag and drop your Excel file
3. **Create Charts**: Select chart type and axes
4. **Get AI Insights**: Generate smart analysis of your data
5. **Export Charts**: Download as PNG or PDF

### For Admin Users
1. **View Statistics**: Monitor system usage and user metrics
2. **Manage Users**: Update user roles and permissions
3. **System Overview**: Track analyses and data usage

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
1. Configure environment variables
2. Set up MongoDB connection
3. Deploy backend service

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Configure environment variables

## 🔧 Development

### Backend Development
```bash
cd excel-analytics-backend
npm run dev    # Start with nodemon
npm test       # Run tests
npm run lint   # Check code quality
```

### Frontend Development
```bash
cd excel-analytics-frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📚 Learning Resources

- [React.js Documentation](https://react.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Three.js Documentation](https://threejs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Chart.js** - For excellent 2D charting capabilities
- **Three.js** - For powerful 3D visualization
- **Google Gemini** - For AI-powered data insights
- **MongoDB** - For reliable data storage
- **React Community** - For amazing ecosystem and tools

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using the MERN stack for powerful data visualization and analysis.**
