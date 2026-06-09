const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// 1. Importamos las rutas que armaste
// const authRoutes = require('./src/routes/auth.routes');
const documentRoutes = require('./src/routes/document.routes');
const chatRoutes = require('./src/routes/chat.routes');
const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Endpoint de salud para el monitoreo de Render
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        estado: 'OK', 
        mensaje: 'Servidor RAG funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// 2. Conectamos tus rutas a la API
// app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/chat', chatRoutes);

module.exports = app;