// routes/files.js
const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize global in-memory storage for analyses
if (!global.inMemoryAnalyses) {
  global.inMemoryAnalyses = [];
}
if (!global.analysisIdCounter) {
  global.analysisIdCounter = 1;
}

// Helper functions for in-memory operations
const createAnalysisInMemory = (analysisData) => {
  const analysis = {
    _id: global.analysisIdCounter++,
    ...analysisData,
    charts: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  global.inMemoryAnalyses.push(analysis);
  return analysis;
};

const findAnalysisInMemory = (id, userId) => {
  return global.inMemoryAnalyses.find(analysis => analysis._id == id && analysis.userId == userId);
};

const findAnalysesByUserInMemory = (userId) => {
  return global.inMemoryAnalyses.filter(analysis => analysis.userId == userId);
};

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  }
});

// Upload and parse Excel file
router.post('/upload', auth, upload.single('excel'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    if (jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    // Extract column headers
    const columns = Object.keys(jsonData[0]);
    
    // Create analysis record
    const analysisData = {
      userId: req.userId,
      filename: `${Date.now()}_${req.file.originalname}`,
      originalName: req.file.originalname,
      data: jsonData,
      columns,
      rowCount: jsonData.length
    };

    let analysis;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      analysis = new Analysis(analysisData);
      await analysis.save();
    } else {
      // Use in-memory storage
      analysis = createAnalysisInMemory(analysisData);
    }

    res.json({
      message: 'File uploaded and parsed successfully',
      analysis: {
        id: analysis._id,
        filename: analysis.originalName,
        columns: analysis.columns,
        rowCount: analysis.rowCount,
        uploadDate: analysis.createdAt,
        data: analysis.data // Include data for demo mode
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
});

// Get user's upload history
router.get('/history', auth, async (req, res) => {
  try {
    let analyses;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      analyses = await Analysis.find({ userId: req.userId })
        .select('filename originalName columns rowCount createdAt')
        .sort({ createdAt: -1 });
    } else {
      // Use in-memory storage
      analyses = findAnalysesByUserInMemory(req.userId)
        .map(analysis => ({
          _id: analysis._id,
          filename: analysis.filename,
          originalName: analysis.originalName,
          columns: analysis.columns,
          rowCount: analysis.rowCount,
          createdAt: analysis.createdAt
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(analyses);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// Get specific analysis data
router.get('/:id', auth, async (req, res) => {
  try {
    let analysis;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      analysis = await Analysis.findOne({ 
        _id: req.params.id, 
        userId: req.userId 
      });
    } else {
      // Use in-memory storage
      analysis = findAnalysisInMemory(req.params.id, req.userId);
    }

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Error fetching analysis' });
  }
});

// Create chart
router.post('/:id/chart', auth, async (req, res) => {
  try {
    const { chartType, xAxis, yAxis } = req.body;
    let analysis;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      analysis = await Analysis.findOne({ 
        _id: req.params.id, 
        userId: req.userId 
      });
    } else {
      // Use in-memory storage
      analysis = findAnalysisInMemory(req.params.id, req.userId);
    }

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Process data for chart
    const chartData = processDataForChart(analysis.data, xAxis, yAxis, chartType);
    
    // Save chart configuration
    const chartConfig = {
      type: chartType,
      xAxis,
      yAxis,
      config: chartData
    };

    if (req.isMongoConnected) {
      // Use MongoDB
      analysis.charts.push(chartConfig);
      await analysis.save();
    } else {
      // Use in-memory storage
      analysis.charts.push(chartConfig);
    }

    res.json({
      message: 'Chart created successfully',
      chart: chartConfig
    });
  } catch (error) {
    console.error('Chart creation error:', error);
    res.status(500).json({ message: 'Error creating chart' });
  }
});

function processDataForChart(data, xAxis, yAxis, chartType) {
  const labels = data.map(row => row[xAxis]);
  const values = data.map(row => parseFloat(row[yAxis]) || 0);

  switch (chartType) {
    case 'bar':
    case 'line':
      return {
        labels,
        datasets: [{
          label: yAxis,
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
    case 'pie':
      return {
        labels: [...new Set(labels)],
        datasets: [{
          data: [...new Set(labels)].map(label => 
            values.filter((_, i) => labels[i] === label).reduce((a, b) => a + b, 0)
          ),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ]
        }]
      };
    default:
      return { labels, values };
  }
}

// AI Summary endpoint
router.post('/:id/ai-summary', auth, async (req, res) => {
  try {
    let analysis;
    
    if (req.isMongoConnected) {
      analysis = await Analysis.findOne({ 
        _id: req.params.id, 
        userId: req.userId 
      });
    } else {
      analysis = findAnalysisInMemory(req.params.id, req.userId);
    }

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Generate a demo AI summary since we don't have API keys
    const demoSummary = generateDemoAISummary(analysis);

    res.json({
      summary: demoSummary,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('AI Summary error:', error);
    res.status(500).json({ message: 'Error generating AI summary' });
  }
});

function generateDemoAISummary(analysis) {
  const { data, columns, rowCount, originalName } = analysis;
  const numericColumns = columns.filter(col => 
    data.some(row => typeof row[col] === 'number' || !isNaN(parseFloat(row[col])))
  );
  
  return `
📊 **AI Analysis Summary for ${originalName}**

**Dataset Overview:**
- Total rows: ${rowCount}
- Total columns: ${columns.length}
- Numeric columns detected: ${numericColumns.join(', ') || 'None'}

**Key Insights:**
1. **Data Structure**: Your dataset contains ${columns.length} different attributes with ${rowCount} data points.
2. **Data Types**: ${numericColumns.length} numeric columns suitable for quantitative analysis.
3. **Completeness**: Dataset appears well-structured for analysis.

**Recommended Visualizations:**
${numericColumns.length > 0 ? `
- Bar Chart: Compare values across categories
- Line Chart: Show trends over time if date column present
- Pie Chart: Show distribution of categorical data
` : `
- Focus on categorical data visualization
- Consider data transformation for numeric analysis
`}

**Suggestions:**
- Consider cleaning any missing values
- Look for outliers in numeric data
- Explore correlations between variables
- Create time-series analysis if date columns are present

*This is a demo AI summary. In production, this would use advanced AI models for deeper insights.*
  `.trim();
}

module.exports = router;
