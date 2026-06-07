const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Endpoint de salud (para el deploy en Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduBot RAG Online 🚀' });
});

module.exports = app;