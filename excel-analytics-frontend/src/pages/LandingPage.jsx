import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Excel Analytics Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Powerful Excel Data Analysis & Visualization
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your Excel files and create beautiful interactive charts with AI-powered insights. 
            Transform your data into meaningful visualizations in minutes.
          </p>
          
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Start Free Trial
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy File Upload</h3>
            <p className="text-gray-600">
              Simply drag and drop your Excel files (.xls, .xlsx) or browse to upload. 
              Our platform automatically parses and analyzes your data.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Charts</h3>
            <p className="text-gray-600">
              Create stunning 2D and 3D visualizations including bar charts, line graphs, 
              pie charts, and scatter plots with dynamic axis selection.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Get intelligent analysis and recommendations about your data using advanced AI. 
              Discover patterns and trends you might have missed.
            </p>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Built with Modern Technology</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">⚛️</div>
              <h4 className="font-semibold text-gray-900">React.js</h4>
              <p className="text-sm text-gray-600">Modern UI Library</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🟢</div>
              <h4 className="font-semibold text-gray-900">Node.js</h4>
              <p className="text-sm text-gray-600">Backend Runtime</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🍃</div>
              <h4 className="font-semibold text-gray-900">MongoDB</h4>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤖</div>
              <h4 className="font-semibold text-gray-900">AI Integration</h4>
              <p className="text-sm text-gray-600">Smart Analysis</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 Excel Analytics Platform. Built with MERN Stack for powerful data visualization.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage