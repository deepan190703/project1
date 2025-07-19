// routes/files.js
const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
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

// Helper function to validate ID parameter
const validateIdParameter = (id) => {
  // Check if id is undefined, null, empty, or the string "undefined"
  if (!id || id === 'undefined' || id === 'null') {
    return false;
  }
  
  // For MongoDB ObjectId validation (24 character hex string)
  if (typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
    return true;
  }
  
  // For in-memory ID validation (should be a number or string representation of number)
  if (typeof id === 'string' && /^\d+$/.test(id)) {
    return true;
  }
  
  if (typeof id === 'number' && id > 0) {
    return true;
  }
  
  return false;
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
    // Validate ID parameter
    if (!validateIdParameter(req.params.id)) {
      return res.status(400).json({ message: 'Invalid analysis ID provided' });
    }

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
    // Validate ID parameter
    if (!validateIdParameter(req.params.id)) {
      return res.status(400).json({ message: 'Invalid analysis ID provided' });
    }

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
    // Validate ID parameter
    if (!validateIdParameter(req.params.id)) {
      return res.status(400).json({ message: 'Invalid analysis ID provided' });
    }

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

// Download chart endpoint
router.get('/:id/download/:format', auth, async (req, res) => {
  try {
    // Validate ID parameter
    if (!validateIdParameter(req.params.id)) {
      return res.status(400).json({ message: 'Invalid analysis ID provided' });
    }

    const { format } = req.params;
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

    if (!['png', 'pdf'].includes(format)) {
      return res.status(400).json({ message: 'Invalid format. Use png or pdf' });
    }

    // Generate proper chart images and PDFs
    if (format === 'png') {
      // Create a proper PNG response with canvas
      const demoImageData = generateDemoChart(analysis);
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${analysis.originalName}-chart.png"`);
      res.send(Buffer.from(demoImageData, 'base64'));
    } else if (format === 'pdf') {
      // Create a proper PDF response with PDFKit
      const demoPDFData = await generateDemoPDF(analysis);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${analysis.originalName}-chart.pdf"`);
      res.send(Buffer.from(demoPDFData, 'base64'));
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error generating download' });
  }
});

// Chart generation with Canvas
function generateDemoChart(analysis) {
  try {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw title
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Chart for ${analysis.originalName}`, 400, 40);
    
    // Draw chart info
    ctx.font = '16px Arial';
    ctx.fillText(`Data: ${analysis.rowCount} rows, ${analysis.columns.length} columns`, 400, 80);
    
    // Sample data for visualization
    const data = analysis.data.slice(0, 10); // First 10 rows
    const barWidth = 60;
    const barSpacing = 20;
    const chartStartY = 450;
    const maxBarHeight = 300;
    
    // Find numeric column for simple bar chart
    let numericColumn = null;
    let labelColumn = null;
    
    for (const col of analysis.columns) {
      if (data.some(row => !isNaN(parseFloat(row[col])))) {
        numericColumn = col;
        break;
      }
    }
    
    // Use first column as label
    labelColumn = analysis.columns[0];
    
    if (numericColumn && data.length > 0) {
      const values = data.map(row => parseFloat(row[numericColumn]) || 0);
      const maxValue = Math.max(...values) || 1;
      
      // Draw bars
      data.forEach((row, index) => {
        if (index >= 10) return; // Limit to 10 bars
        
        const value = parseFloat(row[numericColumn]) || 0;
        const barHeight = (value / maxValue) * maxBarHeight;
        const x = 50 + (index * (barWidth + barSpacing));
        
        // Draw bar
        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(x, chartStartY - barHeight, barWidth, barHeight);
        
        // Draw value
        ctx.fillStyle = '#333333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + barWidth/2, chartStartY - barHeight - 5);
        
        // Draw label
        ctx.save();
        ctx.translate(x + barWidth/2, chartStartY + 15);
        ctx.rotate(-Math.PI/4);
        ctx.textAlign = 'right';
        ctx.fillText(row[labelColumn]?.toString().substring(0, 10) || '', 0, 0);
        ctx.restore();
      });
      
      // Draw axes labels
      ctx.fillStyle = '#666666';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(labelColumn, 400, 580);
      
      ctx.save();
      ctx.translate(20, 300);
      ctx.rotate(-Math.PI/2);
      ctx.fillText(numericColumn, 0, 0);
      ctx.restore();
    } else {
      // No numeric data, show data table preview
      ctx.fillStyle = '#666666';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      
      // Headers
      let y = 150;
      const colWidth = 120;
      analysis.columns.slice(0, 6).forEach((col, index) => {
        ctx.fillText(col.substring(0, 15), 50 + (index * colWidth), y);
      });
      
      // Data rows
      data.slice(0, 15).forEach((row, rowIndex) => {
        y += 25;
        analysis.columns.slice(0, 6).forEach((col, colIndex) => {
          const cellValue = row[col]?.toString().substring(0, 12) || '';
          ctx.fillText(cellValue, 50 + (colIndex * colWidth), y);
        });
      });
    }
    
    return canvas.toBuffer('image/png').toString('base64');
  } catch (error) {
    console.error('Chart generation error:', error);
    // Fallback to simple chart
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(400, 300);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 300);
    
    ctx.fillStyle = '#333333';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Chart Preview', 200, 150);
    ctx.font = '14px Arial';
    ctx.fillText(analysis.originalName, 200, 180);
    
    return canvas.toBuffer('image/png').toString('base64');
  }
}

// PDF generation with PDFKit
function generateDemoPDF(analysis) {
  try {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {});
    
    // Add title
    doc.fontSize(20).text(`Analysis Report: ${analysis.originalName}`, 50, 50);
    
    // Add metadata
    doc.fontSize(12)
       .text(`Generated: ${new Date().toLocaleDateString()}`, 50, 90)
       .text(`Rows: ${analysis.rowCount}`, 50, 110)
       .text(`Columns: ${analysis.columns.length}`, 50, 130);
    
    // Add column headers
    doc.fontSize(14).text('Data Columns:', 50, 170);
    let yPos = 190;
    analysis.columns.forEach((col, index) => {
      if (index < 20) { // Limit to prevent overflow
        doc.fontSize(10).text(`• ${col}`, 70, yPos);
        yPos += 15;
      }
    });
    
    // Add sample data
    yPos += 20;
    doc.fontSize(14).text('Sample Data (First 10 rows):', 50, yPos);
    yPos += 20;
    
    // Table headers
    let xPos = 50;
    analysis.columns.slice(0, 4).forEach(col => {
      doc.fontSize(8).text(col.substring(0, 12), xPos, yPos, {width: 120});
      xPos += 125;
    });
    yPos += 20;
    
    // Table data
    analysis.data.slice(0, 10).forEach(row => {
      xPos = 50;
      analysis.columns.slice(0, 4).forEach(col => {
        const value = row[col]?.toString().substring(0, 15) || '';
        doc.fontSize(8).text(value, xPos, yPos, {width: 120});
        xPos += 125;
      });
      yPos += 15;
      if (yPos > 700) return; // Prevent overflow
    });
    
    // Add chart placeholder
    yPos += 30;
    if (yPos < 650) {
      doc.fontSize(12).text('Chart would be displayed here in full implementation', 50, yPos);
      doc.rect(50, yPos + 20, 400, 200).stroke();
      doc.fontSize(10).text('Chart Preview Area', 230, yPos + 110);
    }
    
    doc.end();
    
    // Wait for the PDF to be generated
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks).toString('base64'));
      });
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    // Return a simple valid PDF
    return 'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSA+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNTMgMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE4MwolJUVPRg==';
  }
}

module.exports = router;
