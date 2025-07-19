import { useState, useEffect, useCallback } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import Chart3D from './Chart3D'
import api from '../utils/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ChartBuilder = ({ analysisData, onChartCreated }) => {
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    xAxis: '',
    yAxis: '',
  })
  const [chartData, setChartData] = useState(null)

  const [isDownloading, setIsDownloading] = useState(false)

  const generateChartData = useCallback(() => {
    if (!analysisData || !chartConfig.xAxis || !chartConfig.yAxis) return

    const labels = analysisData.data.map(row => row[chartConfig.xAxis])
    const values = analysisData.data.map(row => parseFloat(row[chartConfig.yAxis]) || 0)

    let data
    switch (chartConfig.type) {
      case 'bar':
      case 'line': {
        data = {
          labels,
          datasets: [{
            label: chartConfig.yAxis,
            data: values,
            backgroundColor: chartConfig.type === 'bar' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(75, 192, 192, 0.2)',
            borderColor: chartConfig.type === 'bar' ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: chartConfig.type === 'line' ? false : true,
          }]
        }
        break
      }
      
      case 'pie': {
        const uniqueLabels = [...new Set(labels)]
        const pieData = uniqueLabels.map(label => {
          const indices = labels.map((l, i) => l === label ? i : -1).filter(i => i !== -1)
          return indices.reduce((sum, i) => sum + values[i], 0)
        })
        
        data = {
          labels: uniqueLabels,
          datasets: [{
            data: pieData,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
            ],
            borderWidth: 1,
          }]
        }
        break
      }
      
      case '3d': {
        data = {
          labels,
          datasets: [{
            label: chartConfig.yAxis,
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        }
        break
      }
      
      default:
        data = { labels, datasets: [] }
    }

    setChartData(data)
  }, [analysisData, chartConfig.type, chartConfig.xAxis, chartConfig.yAxis])

  useEffect(() => {
    if (chartConfig.xAxis && chartConfig.yAxis && analysisData) {
      generateChartData()
    }
  }, [chartConfig, analysisData, generateChartData])

  const handleConfigChange = (field, value) => {
    setChartConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveChart = () => {
    if (chartData && onChartCreated) {
      onChartCreated({
        type: chartConfig.type,
        xAxis: chartConfig.xAxis,
        yAxis: chartConfig.yAxis,
        data: chartData
      })
    }
  }

  const handleDownload = async (format) => {
    if (!chartData || isDownloading) return
    
    setIsDownloading(true)
    try {
      // For client-side download since backend puppeteer has issues
      let canvas
      let fileName = `chart_${chartConfig.type}_${Date.now()}`
      
      if (chartConfig.type === '3d') {
        // For 3D charts, get the canvas from Three.js renderer
        const chartContainer = document.querySelector('.w-full.h-full.flex.flex-col')
        if (chartContainer) {
          const threeCanvas = chartContainer.querySelector('canvas')
          if (threeCanvas) {
            canvas = threeCanvas
          }
        }
      } else {
        // For 2D charts, get the canvas from Chart.js
        const chartContainer = document.querySelector('.bg-gray-50')
        if (chartContainer) {
          const chartCanvas = chartContainer.querySelector('canvas')
          if (chartCanvas) {
            canvas = chartCanvas
          }
        }
      }
      
      if (canvas) {
        if (format === 'png') {
          // Create download link for PNG
          const dataURL = canvas.toDataURL('image/png')
          const link = document.createElement('a')
          link.href = dataURL
          link.download = `${fileName}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else if (format === 'pdf') {
          // For PDF, we'll create a simple PDF with the image
          const dataURL = canvas.toDataURL('image/png')
          
          // Create a simple PDF using a data URL (basic implementation)
          const link = document.createElement('a')
          link.href = dataURL
          link.download = `${fileName}.png` // Fallback to PNG since we don't have PDF library
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          alert('PDF export converted to PNG format due to technical limitations')
        }
      } else {
        // Fallback: try the API if canvas not found
        try {
          const response = await api.get(`/files/${analysisData.id}/download/${format}`, {
            responseType: 'blob'
          })
          
          const blob = new Blob([response.data], { 
            type: format === 'png' ? 'image/png' : 'application/pdf' 
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${analysisData.filename || 'chart'}.${format}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } catch (apiError) {
          console.error('API Download error:', apiError)
          alert('Download failed. Chart canvas not found and API unavailable.')
        }
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const renderChart = () => {
    if (!chartData) return null

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${chartConfig.yAxis} vs ${chartConfig.xAxis}`,
        },
      },
      ...(chartConfig.type !== 'pie' && {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }),
    }

    switch (chartConfig.type) {
      case 'bar':
        return <Bar data={chartData} options={options} />
      case 'line':
        return <Line data={chartData} options={options} />
      case 'pie':
        return <Pie data={chartData} options={options} />
      case '3d':
        return <Chart3D data={chartData} xAxis={chartConfig.xAxis} yAxis={chartConfig.yAxis} />
      default:
        return null
    }
  }

  if (!analysisData) {
    return (
      <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 Chart Builder</h3>
        <div className="text-gray-600 space-y-2">
          <p className="text-lg">Ready to visualize your data?</p>
          <p className="text-sm">Upload an Excel file to start building interactive charts</p>
        </div>
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>📊 2D Charts</span>
            <span>🎯 3D Visualizations</span>
            <span>📈 Interactive Controls</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-white to-gray-50">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">📊 Chart Builder</h3>
        <p className="text-gray-600">Create stunning visualizations from your data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="form-label flex items-center">
            <span className="mr-2">📊</span>
            Chart Type
          </label>
          <select
            className="form-input transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={chartConfig.type}
            onChange={(e) => handleConfigChange('type', e.target.value)}
          >
            <option value="bar">📊 Bar Chart</option>
            <option value="line">📈 Line Chart</option>
            <option value="pie">🥧 Pie Chart</option>
            <option value="3d">🎯 3D Chart</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="form-label flex items-center">
            <span className="mr-2">➡️</span>
            X-Axis
          </label>
          <select
            className="form-input transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={chartConfig.xAxis}
            onChange={(e) => handleConfigChange('xAxis', e.target.value)}
          >
            <option value="">Select X-Axis</option>
            {analysisData.columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="form-label flex items-center">
            <span className="mr-2">⬆️</span>
            Y-Axis
          </label>
          <select
            className="form-input transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={chartConfig.yAxis}
            onChange={(e) => handleConfigChange('yAxis', e.target.value)}
          >
            <option value="">Select Y-Axis</option>
            {analysisData.columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>
      </div>

      {chartData && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg border">
            <div className={chartConfig.type === '3d' ? 'h-auto' : 'h-96'}>
              {renderChart()}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <button
              onClick={handleSaveChart}
              className="btn-primary flex items-center space-x-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>💾</span>
              <span>Save Chart</span>
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleDownload('png')}
                disabled={isDownloading}
                className="btn-secondary flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                <span>🖼️</span>
                <span>{isDownloading ? 'Downloading...' : 'Download PNG'}</span>
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                disabled={isDownloading}
                className="btn-secondary flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                <span>📄</span>
                <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {chartConfig.type === '3d' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-xl">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">3D Chart Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Drag to rotate and explore different angles</li>
                    <li>• Use mouse wheel to zoom in and out</li>
                    <li>• Charts are fully interactive and responsive</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChartBuilder