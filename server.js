import dotenv from 'dotenv';
dotenv.config();

// Importamos la app y la configuración
import app from './app.js';
import { getSupabaseClient } from './src/config/supabase.js';

// 1. Verificamos Supabase de entrada
try {
    getSupabaseClient();
    console.log("Supabase inicializado correctamente.");
} catch (e) {
    console.error("ERROR CRÍTICO AL INICIALIZAR SUPABASE:", e.message);
}

// 2. Encendemos el motor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`EduBot RAG corriendo en el puerto ${PORT}`);
    console.log(`Esperando consultas en http://localhost:${PORT}/api/v1/chat/ask`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});