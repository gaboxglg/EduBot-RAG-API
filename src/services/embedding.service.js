const { getGeminiClient } = require('./ai.factory');

const generateEmbedding = async (text) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    
    // Limpiamos los saltos de línea
    const cleanText = text.replace(/\n/g, ' ');
    
    const result = await model.embedContent(cleanText);
    
    // Evitamos devolver null o 0, si no hay valores devolvemos un array vacío
    return result.embedding.values || []; 
  } catch (error) {
    console.error(' Error generando embedding con Gemini:', error);
    throw new Error('No se pudo generar el vector del texto.');
  }
};

module.exports = { generateEmbedding };