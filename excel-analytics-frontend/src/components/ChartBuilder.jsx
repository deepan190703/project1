import { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import Chart3D from './Chart3D'

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
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (chartConfig.xAxis && chartConfig.yAxis && analysisData) {
      generateChartData()
    }
  }, [chartConfig, analysisData])

  const generateChartData = () => {
    if (!analysisData || !chartConfig.xAxis || !chartConfig.yAxis) return

    const labels = analysisData.data.map(row => row[chartConfig.xAxis])
    const values = analysisData.data.map(row => parseFloat(row[chartConfig.yAxis]) || 0)

    let data
    switch (chartConfig.type) {
      case 'bar':
      case 'line':
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
      
      case 'pie':
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
      
      default:
        data = { labels, datasets: [] }
    }

    setChartData(data)
  }

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
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Chart Builder</h3>
        <p className="text-gray-500">Upload an Excel file to start building charts</p>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Chart Builder</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="form-label">Chart Type</label>
          <select
            className="form-input"
            value={chartConfig.type}
            onChange={(e) => handleConfigChange('type', e.target.value)}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="3d">3D Chart</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">X-Axis</label>
          <select
            className="form-input"
            value={chartConfig.xAxis}
            onChange={(e) => handleConfigChange('xAxis', e.target.value)}
          >
            <option value="">Select X-Axis</option>
            {analysisData.columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="form-label">Y-Axis</label>
          <select
            className="form-input"
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
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="h-96">
              {renderChart()}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={handleSaveChart}
              className="btn-primary"
            >
              Save Chart
            </button>
            
            <div className="space-x-2">
              <button
                onClick={() => {/* TODO: Implement download */}}
                className="btn-secondary"
              >
                Download PNG
              </button>
              <button
                onClick={() => {/* TODO: Implement download */}}
                className="btn-secondary"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChartBuilder