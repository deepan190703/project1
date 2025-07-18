# Excel Analytics Platform

A comprehensive web application for uploading, analyzing, and visualizing Excel files with AI-powered insights.

## Features

- **File Upload**: Upload Excel files (XLSX, XLS, CSV formats)
- **Data Visualization**: Interactive charts and graphs (2D and 3D)
- **AI Analysis**: OpenAI-powered data insights and recommendations
- **User Authentication**: Secure login and registration system
- **Analysis History**: Track and review previous analyses
- **Chart Builder**: Create custom charts from your data
- **Admin Dashboard**: Administrative tools and user management

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **OpenAI API** for AI analysis
- **Multer** for file handling
- **XLSX** for Excel file processing

### Frontend
- **React.js** with modern hooks
- **Redux Toolkit** for state management
- **CSS3** for styling
- **Chart.js** for data visualization
- **3D.js** for 3D visualizations

## Project Structure

```
project1/
├── excel-analytics-backend/
│   ├── models/
│   │   ├── Analysis.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── files.js
│   ├── server.js
│   └── package.json
├── excel-analytics-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Chart3D.js
│   │   │   ├── ChartBuilder.js
│   │   │   ├── Dashboard.js
│   │   │   ├── FileUpload.js
│   │   │   └── HistoryDashboard.js
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   └── store.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- OpenAI API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd excel-analytics-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/excel-analytics
   JWT_SECRET=your-jwt-secret
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd excel-analytics-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. **Register/Login**: Create an account or log in to access the platform
2. **Upload Files**: Use the file upload component to upload Excel files
3. **View Analysis**: Get AI-powered insights and recommendations
4. **Create Charts**: Build custom visualizations from your data
5. **Review History**: Access your previous analyses and results
6. **Admin Features**: Manage users and system settings (admin users only)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### File Operations
- `POST /api/files/upload` - Upload Excel file
- `GET /api/files/analysis/:id` - Get file analysis
- `GET /api/files/history` - Get user's analysis history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
