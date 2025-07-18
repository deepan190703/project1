import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import FileUpload from '../components/FileUpload'
import ChartBuilder from '../components/ChartBuilder'
import api from '../utils/api'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  
  const [analysisData, setAnalysisData] = useState(null)
  const [uploadHistory, setUploadHistory] = useState([])
  const [aiSummary, setAiSummary] = useState('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')

  useEffect(() => {
    fetchUploadHistory()
  }, [])

  const fetchUploadHistory = async () => {
    try {
      const response = await api.get('/files/history')
      setUploadHistory(response.data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const handleFileUploaded = (analysis) => {
    setAnalysisData(analysis)
    fetchUploadHistory()
    setActiveTab('chart')
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const generateAISummary = async () => {
    if (!analysisData) return

    setIsLoadingAI(true)
    try {
      const response = await api.post(`/files/${analysisData.id}/ai-summary`)
      setAiSummary(response.data.summary)
    } catch (error) {
      console.error('Error generating AI summary:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const loadPreviousAnalysis = async (analysisId) => {
    try {
      const response = await api.get(`/files/${analysisId}`)
      setAnalysisData(response.data)
      setActiveTab('chart')
    } catch (error) {
      console.error('Error loading analysis:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Excel Analytics Platform</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="btn-secondary"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="btn-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chart'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Chart Builder
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ai'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              AI Insights
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'upload' && (
            <FileUpload onFileUploaded={handleFileUploaded} />
          )}

          {activeTab === 'chart' && (
            <ChartBuilder
              analysisData={analysisData}
              onChartCreated={(chart) => console.log('Chart created:', chart)}
            />
          )}

          {activeTab === 'history' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Upload History</h3>
              {uploadHistory.length === 0 ? (
                <p className="text-gray-500">No files uploaded yet</p>
              ) : (
                <div className="space-y-4">
                  {uploadHistory.map((analysis) => (
                    <div
                      key={analysis._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{analysis.originalName}</h4>
                        <p className="text-sm text-gray-500">
                          {analysis.rowCount} rows, {analysis.columns.length} columns
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => loadPreviousAnalysis(analysis._id)}
                        className="btn-primary"
                      >
                        Load
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
              {!analysisData ? (
                <p className="text-gray-500">Upload a file to get AI insights</p>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={generateAISummary}
                    disabled={isLoadingAI}
                    className="btn-primary"
                  >
                    {isLoadingAI ? 'Generating...' : 'Generate AI Summary'}
                  </button>
                  
                  {aiSummary && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                      <div className="text-sm text-blue-800 whitespace-pre-wrap">
                        {aiSummary}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard