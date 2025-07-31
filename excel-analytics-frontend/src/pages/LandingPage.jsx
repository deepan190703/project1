import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Excel Analytics Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Powerful Excel Data
              </span>
              <br />
              <span className="text-gray-900">Analysis & Visualization</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload your Excel files and create beautiful interactive charts with AI-powered insights. 
              Transform your data into meaningful visualizations in minutes.
            </p>
          </div>
          
          {!isAuthenticated && (
            <div className="space-x-4 animate-fade-in-scale">
              <Link 
                to="/register" 
                className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Free Trial
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-700 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl border border-gray-200 transform hover:-translate-y-1 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-card hover:shadow-card-hover transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
              Easy File Upload
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Simply drag and drop your Excel files (.xls, .xlsx) or browse to upload. 
              Our platform automatically parses and analyzes your data.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-card hover:shadow-card-hover transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
              Interactive Charts
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Create stunning 2D and 3D visualizations including bar charts, line graphs, 
              pie charts, and scatter plots with dynamic axis selection.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-card hover:shadow-card-hover transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
              AI-Powered Insights
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get intelligent analysis and recommendations about your data using advanced AI. 
              Discover patterns and trends you might have missed.
            </p>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-24 bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built with Modern Technology
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⚛️</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">React.js</h4>
              <p className="text-sm text-gray-600">Modern UI Library</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🟢</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Node.js</h4>
              <p className="text-sm text-gray-600">Backend Runtime</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🍃</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">MongoDB</h4>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤖</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI Integration</h4>
              <p className="text-sm text-gray-600">Smart Analysis</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Excel Analytics Platform
              </span>
            </div>
            <p className="text-gray-600 text-lg">
              © 2024 Excel Analytics Platform. Built with MERN Stack for powerful data visualization.
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">Terms</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage