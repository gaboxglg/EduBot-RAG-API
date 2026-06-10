require('dotenv').config();
const express = require('express');
const { getSupabaseClient } = require('./src/config/supabase');
const chatRoutes = require('./src/routes/chat.routes');
const authRoutes = require('./routes/auth.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

// 1. Verificamos Supabase de entrada
try {
    getSupabaseClient();
    console.log(" Supabase inicializado correctamente.");
} catch (e) {
    console.error(" ERROR CRÍTICO AL INICIALIZAR SUPABASE:", e.message);
}

// 2. Inicializamos la app
const app = express();

// 3. Middlewares
app.use(express.json());

// 4. Rutas conectadas
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 5. Encendemos el motor
app.listen(3000, () => {
    console.log(` EduBot RAG corriendo en el puerto 3000`);
    console.log(` Esperando consultas en http://localhost:3000/api/v1/chat/ask`);
});