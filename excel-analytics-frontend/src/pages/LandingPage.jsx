import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-bounce-gentle"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/30 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">
                Excel Analytics Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="relative bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-glow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-indigo-600 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/50 hover:shadow-md hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="relative bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-glow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="animate-fade-in-up">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-indigo-200 shadow-md">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">✨ AI-Powered Analytics Platform</span>
              </div>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Powerful Excel Data
              </span>
              <br />
              <span className="text-gray-900 relative">
                Analysis & Visualization
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Upload your Excel files and create <span className="font-semibold text-indigo-600">beautiful interactive charts</span> with AI-powered insights. 
              Transform your data into <span className="font-semibold text-purple-600">meaningful visualizations</span> in minutes.
            </p>
          </div>
          
          {!isAuthenticated && (
            <div className="space-x-6 animate-fade-in-scale">
              <Link 
                to="/register" 
                className="group relative inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg px-10 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-glow-lg transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <svg className="w-6 h-6 mr-3 z-10 relative group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="relative z-10">Start Free Trial</span>
              </Link>
              
              <Link 
                to="/login" 
                className="group inline-flex items-center bg-white/90 hover:bg-white text-gray-700 hover:text-indigo-600 text-lg px-10 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-glow border border-gray-200 transform hover:-translate-y-2 transition-all duration-300"
              >
                <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
            </div>
          )}
          
          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-gray-600 font-medium">Charts Created</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-gray-600 font-medium">Happy Users</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold text-pink-600 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 relative">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the powerful features that make data analysis effortless and insightful.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-card hover:shadow-card-hover transform hover:-translate-y-4 transition-all duration-500 border border-white/30 overflow-hidden">
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">
                  Easy File Upload
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Simply drag and drop your Excel files (.xls, .xlsx) or browse to upload. 
                  Our platform automatically parses and analyzes your data with lightning speed.
                </p>
                
                {/* Feature highlights */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Supports .xls and .xlsx formats
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Up to 10MB file size
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-card hover:shadow-card-hover transform hover:-translate-y-4 transition-all duration-500 border border-white/30 overflow-hidden">
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors duration-300">
                  Interactive Charts
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Create stunning 2D and 3D visualizations including bar charts, line graphs, 
                  pie charts, and scatter plots with dynamic axis selection and real-time updates.
                </p>
                
                {/* Feature highlights */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Multiple chart types
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Export as PNG/PDF
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-card hover:shadow-card-hover transform hover:-translate-y-4 transition-all duration-500 border border-white/30 overflow-hidden">
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-purple-600 transition-colors duration-300">
                  AI-Powered Insights
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Get intelligent analysis and recommendations about your data using advanced AI. 
                  Discover hidden patterns, trends, and actionable insights automatically.
                </p>
                
                {/* Feature highlights */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Google Gemini AI integration
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Smart recommendations
                  </div>
                </div>
              </div>
            </div>
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