import { useState } from 'react'
import api from '../utils/api'

const FileUpload = ({ onFileUploaded }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (file) => {
    if (!file) return

    // Check file type
    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('Please upload an Excel file (.xls or .xlsx)')
      return
    }

    setIsUploading(true)
    setUploadStatus('')

    try {
      const formData = new FormData()
      formData.append('excel', file)

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadStatus('File uploaded successfully!')
      onFileUploaded && onFileUploaded(response.data.analysis)
    } catch (error) {
      setUploadStatus(error.response?.data?.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  return (
    <div className="card p-6 hover-lift animate-fadeInUp">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">📁 Upload Excel File</h3>
        <p className="text-gray-600">Drag and drop your Excel file or click to browse</p>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            dragActive 
              ? 'bg-gradient-primary text-white scale-110' 
              : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'
          }`}>
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {dragActive ? 'Drop your file here!' : 'Upload your Excel file'}
            </p>
            <p className="text-gray-600 mb-4">
              Supports .xls and .xlsx formats
            </p>
            
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleInputChange}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className="btn-primary inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>📂</span>
              <span>Choose File</span>
            </label>
          </div>
          
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>.xlsx files</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>.xls files</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {isUploading && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fadeInScale">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">Processing your file...</span>
          </div>
        </div>
      )}

      {uploadStatus && !isUploading && (
        <div className={`mt-6 p-4 rounded-lg animate-fadeInScale ${
          uploadStatus.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-3">
            <span className="text-xl">
              {uploadStatus.includes('successfully') ? '✅' : '❌'}
            </span>
            <span className="font-medium">{uploadStatus}</span>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Quick Tips
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Ensure your Excel file has column headers in the first row</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Data will be automatically analyzed for chart creation</li>
        </ul>
      </div>
    </div>
  )
}

export default FileUpload