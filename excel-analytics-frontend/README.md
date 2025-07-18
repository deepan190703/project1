# Excel Analytics Platform - Frontend

React-based frontend application for the Excel Analytics Platform. Built with modern web technologies for data visualization and analysis.

## 🚀 Features

- **Modern React App** - Built with React 19 and Vite
- **Responsive Design** - Works on all device sizes
- **Interactive Charts** - 2D and 3D data visualizations
- **File Upload** - Drag-and-drop interface for Excel files
- **Real-time Updates** - Dynamic chart generation
- **User Authentication** - Secure login and registration
- **Admin Panel** - User management interface
- **AI Integration** - Smart data insights

## 🛠️ Tech Stack

- **React.js** - Modern UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Chart.js** - 2D charts
- **Three.js** - 3D visualizations
- **Vite** - Fast development build tool
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v16 or higher)
- Backend server running on port 5000

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the app**
   - Open http://localhost:5173 in your browser

## 🏗️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Login.jsx       # Authentication component
│   ├── Register.jsx    # User registration
│   ├── FileUpload.jsx  # File upload interface
│   ├── ChartBuilder.jsx # Chart creation tool
│   └── Chart3D.jsx     # 3D visualization
├── pages/              # Route components
│   ├── LandingPage.jsx # Home page
│   ├── Dashboard.jsx   # Main dashboard
│   └── AdminDashboard.jsx # Admin interface
├── store/              # Redux store
│   ├── store.js        # Store configuration
│   └── authSlice.js    # Authentication state
├── utils/              # Utility functions
│   └── api.js          # API client
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Components

### Authentication
- **Login** - User login form
- **Register** - User registration form

### Data Visualization
- **FileUpload** - Excel file upload with drag-and-drop
- **ChartBuilder** - Interactive chart creation
- **Chart3D** - Three.js 3D visualizations

### Dashboard
- **Dashboard** - Main user interface
- **AdminDashboard** - Admin management panel
- **LandingPage** - Welcome page

## 🔄 State Management

Uses Redux Toolkit for:
- User authentication state
- File upload status
- Chart data management
- Error handling

## 🎯 Key Features

### File Upload
- Drag-and-drop interface
- Excel file validation
- Progress indicators
- Error handling

### Chart Generation
- Multiple chart types (bar, line, pie, 3D)
- Dynamic axis selection
- Real-time updates
- Export functionality

### User Management
- JWT-based authentication
- Protected routes
- Role-based access control

## 🚀 Building for Production

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy** to platforms like:
   - Netlify
   - Vercel
   - GitHub Pages

## 🔧 Configuration

### Environment Variables
No environment variables needed for development. The app connects to the backend at `http://localhost:5000`.

For production, update the API URL in `src/utils/api.js`.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License
