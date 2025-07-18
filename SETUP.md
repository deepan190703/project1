# Excel Analytics Platform - Complete Setup Guide

A comprehensive web application for uploading, analyzing, and visualizing Excel files with AI-powered insights.

## 🚀 Live Application Preview

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/0c4cf700-5642-4839-abe0-868bead4adc7)

### Authentication
![Login](https://github.com/user-attachments/assets/ee85954d-ab87-459f-9df9-e5d99f8dcad9)
![Register](https://github.com/user-attachments/assets/2f2448ea-35d5-430d-b746-59dd03b91ae2)

## ✨ Features

### Core Features
- **📊 Excel File Upload**: Support for .xls and .xlsx files with drag-and-drop interface
- **📈 Interactive Charts**: Create 2D and 3D visualizations (bar, line, pie, scatter plots)
- **🤖 AI Analysis**: Google Gemini-powered data insights and recommendations
- **🔐 User Authentication**: Secure JWT-based login and registration
- **📋 Analysis History**: Track and review previous analyses
- **👑 Admin Dashboard**: User management and system statistics
- **📱 Responsive Design**: Works on desktop and mobile devices
- **💾 Chart Export**: Download charts as PNG/PDF files

### Technical Features
- **Dynamic Axis Selection**: Choose X and Y axes from Excel column headers
- **Real-time Visualization**: Interactive charts update as you select different data
- **User Session Management**: Persistent login with JWT tokens
- **File Processing**: Robust Excel parsing with SheetJS
- **AI Integration**: Optional Google Gemini API for smart insights

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Google Gemini API** for AI analysis
- **Multer** for file handling
- **XLSX** for Excel file processing
- **Puppeteer** for chart export

### Frontend
- **React.js** with modern hooks
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Chart.js** for 2D data visualization
- **Three.js** for 3D visualizations
- **Vite** for fast development
- **Custom CSS** for responsive design

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Gemini API key** (optional for AI features)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/deepan190703/project1.git
cd project1
```

### 2. Backend Setup

```bash
cd excel-analytics-backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your-secure-jwt-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../excel-analytics-frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🗃️ Database Setup

### Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. The application will automatically create the database and collections

### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### File Operations
- `POST /api/files/upload` - Upload Excel file
- `GET /api/files/history` - Get user's upload history
- `GET /api/files/:id` - Get specific analysis data
- `POST /api/files/:id/chart` - Create chart from analysis
- `POST /api/files/:id/ai-summary` - Generate AI insights
- `GET /api/files/:id/download/:format` - Download chart (PNG/PDF)

### Admin Operations
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 📱 Usage Guide

### 1. Getting Started
1. Visit the landing page
2. Click "Get Started" to create an account
3. Fill in your details and register
4. You'll be automatically logged in and redirected to the dashboard

### 2. Uploading Files
1. Go to the "Upload File" tab
2. Drag and drop your Excel file or click to browse
3. Supported formats: .xls, .xlsx
4. The file will be automatically parsed and analyzed

### 3. Creating Charts
1. After uploading, go to the "Chart Builder" tab
2. Select chart type (bar, line, pie, 3D)
3. Choose X and Y axes from your data columns
4. The chart will update in real-time
5. Save and download your charts

### 4. AI Insights
1. Go to the "AI Insights" tab
2. Click "Generate AI Summary"
3. Get intelligent analysis of your data patterns
4. Receive recommendations for visualization types

### 5. Admin Features
1. Admin users can access the Admin Panel
2. View system statistics
3. Manage users and their roles
4. Monitor data usage

## 🎨 Development Timeline

This project follows a structured 5-week development plan:

### Week 1: Foundation
- ✅ Project setup and authentication
- ✅ User registration and login
- ✅ Dashboard layout and navigation

### Week 2: Core Features
- ✅ Excel file upload and parsing
- ✅ Data storage in MongoDB
- ✅ Basic chart rendering

### Week 3: Advanced Visualization
- ✅ Chart.js integration for 2D charts
- ✅ Three.js for 3D visualizations
- ✅ Dynamic axis selection

### Week 4: AI & Export
- ✅ Google Gemini AI integration
- ✅ Chart export functionality
- ✅ Analysis history tracking

### Week 5: Polish & Deploy
- ✅ Admin panel completion
- ✅ Responsive design
- ✅ Testing and bug fixes
- ✅ Production deployment ready

## 🚀 Production Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy backend service
4. Update CORS settings for production

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up domain and SSL

## 🎯 Key Features Implemented

- [x] **User Authentication** - JWT-based secure login/register
- [x] **File Upload** - Drag-and-drop Excel file interface
- [x] **Data Parsing** - Robust Excel file processing with SheetJS
- [x] **Chart Generation** - Interactive 2D and 3D visualizations
- [x] **AI Integration** - Google Gemini API for smart insights
- [x] **Admin Dashboard** - User management and system statistics
- [x] **Chart Export** - Download charts as PNG/PDF
- [x] **Responsive Design** - Works on all device sizes
- [x] **User History** - Track and reload previous analyses
- [x] **Real-time Updates** - Dynamic chart updates on axis selection

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Chart Not Rendering**
   - Check browser console for errors
   - Ensure data has numeric values for Y-axis
   - Verify column names match Excel headers

3. **AI Summary Not Working**
   - Verify `GEMINI_API_KEY` is set correctly
   - Check API quota and billing
   - Ensure network connectivity

4. **File Upload Fails**
   - Check file format (.xls, .xlsx)
   - Verify file size limits
   - Ensure backend is running

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔗 References

- [Chart.js Documentation](https://www.chartjs.org/)
- [Three.js Documentation](https://threejs.org/)
- [SheetJS Documentation](https://sheetjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

Built with ❤️ using the MERN stack for powerful data visualization and analysis.