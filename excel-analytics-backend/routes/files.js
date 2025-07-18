// routes/files.js
const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/auth');

const router = express.Router();

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
    const analysis = new Analysis({
      userId: req.userId,
      filename: `${Date.now()}_${req.file.originalname}`,
      originalName: req.file.originalname,
      data: jsonData,
      columns,
      rowCount: jsonData.length
    });

    await analysis.save();

    res.json({
      message: 'File uploaded and parsed successfully',
      analysis: {
        id: analysis._id,
        filename: analysis.originalName,
        columns: analysis.columns,
        rowCount: analysis.rowCount,
        uploadDate: analysis.createdAt
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
    const analyses = await Analysis.find({ userId: req.userId })
      .select('filename originalName columns rowCount createdAt')
      .sort({ createdAt: -1 });

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// Get specific analysis data
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analysis' });
  }
});

// Add to routes/files.js
router.post('/:id/chart', auth, async (req, res) => {
  try {
    const { chartType, xAxis, yAxis } = req.body;
    const analysis = await Analysis.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

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

    analysis.charts.push(chartConfig);
    await analysis.save();

    res.json({
      message: 'Chart created successfully',
      chart: chartConfig
    });
  } catch (error) {
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

// Add to routes/files.js
const sharp = require('sharp'); // Install: npm install sharp
const puppeteer = require('puppeteer'); // Install: npm install puppeteer

router.get('/:id/download/:format', auth, async (req, res) => {
  try {
    const { format } = req.params;
    const analysis = await Analysis.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    if (format === 'png') {
      // Generate PNG using puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      // Create HTML with chart
      const html = generateChartHTML(analysis.charts[0]);
      await page.setContent(html);
      await page.setViewport({ width: 800, height: 600 });
      
      const screenshot = await page.screenshot({ 
        type: 'png',
        fullPage: true 
      });
      
      await browser.close();
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${analysis.originalName}_chart.png"`);
      res.send(screenshot);
    } else if (format === 'pdf') {
      // Generate PDF
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      const html = generateChartHTML(analysis.charts[0]);
      await page.setContent(html);
      
      const pdf = await page.pdf({ 
        format: 'A4',
        printBackground: true 
      });
      
      await browser.close();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${analysis.originalName}_chart.pdf"`);
      res.send(pdf);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error generating download' });
  }
});

function generateChartHTML(chart) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <canvas id="chart" width="800" height="600"></canvas>
      <script>
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, ${JSON.stringify({
          type: chart.type,
          data: chart.config,
          options: {
            responsive: false,
            animation: false
          }
        })});
      </script>
    </body>
    </html>
  `;
}

// Add to routes/files.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/:id/ai-summary', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Prepare data summary for AI
    const dataPreview = analysis.data.slice(0, 10);
    const prompt = `
      Analyze this Excel data and provide insights:
      
      File: ${analysis.originalName}
      Rows: ${analysis.rowCount}
      Columns: ${analysis.columns.join(', ')}
      
      Sample data (first 10 rows):
      ${JSON.stringify(dataPreview, null, 2)}
      
      Please provide:
      1. Key insights about the data
      2. Potential trends or patterns
      3. Suggested visualizations
      4. Data quality observations
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiSummary = response.text();

    res.json({
      summary: aiSummary,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('AI Summary error:', error);
    res.status(500).json({ message: 'Error generating AI summary' });
  }
});



module.exports = router;
