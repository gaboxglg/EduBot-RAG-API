import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

// Truco necesario para poder importar archivos .json en ES Modules
const require = createRequire(import.meta.url);
const swaggerDocument = require('./docs/swagger.json');

// 1. Importamos las rutas 
 import authRoutes from './src/routes/auth.routes.js';
import documentRoutes from './src/routes/document.routes.js';
import chatRoutes from './src/routes/chat.routes.js';

const app = express();

// 2. Middlewares de seguridad y configuración
app.use(helmet());
app.use(cors());


app.use(express.json());

// 3. Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint de salud para el monitoreo de Render
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        estado: 'OK', 
        mensaje: 'Servidor RAG funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// 4. Conectamos tus rutas a la API
 app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/chat', chatRoutes);

// Exportamos usando ES Modules
export default app;