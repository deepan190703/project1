// models/Analysis.js
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  columns: [{ type: String }],
  rowCount: { type: Number },
  charts: [{
    type: { type: String, enum: ['bar', 'line', 'pie', 'scatter', '3d-column'] },
    xAxis: String,
    yAxis: String,
    config: mongoose.Schema.Types.Mixed
  }]
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
