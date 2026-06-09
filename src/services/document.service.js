const { generateEmbedding } = require('./embedding.service');
const { save } = require('../repositories/document.repository');

// Función para cortar el texto largo en pedazos más chicos (chunks)
const splitTextIntoChunks = (text, chunkSize = 1000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  // Retornamos un array vacío en caso de que no haya texto, para mantener buenas prácticas
  return chunks.length > 0 ? chunks : []; 
};

// El director de orquesta que une todo
const processAndSaveDocument = async (text, sourceFile) => {
  try {
    const chunks = splitTextIntoChunks(text);
    const savedChunks = [];

    // Procesamos cada pedazo de texto uno por uno
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      
      // 1. Transformamos el texto en un vector matemático con Gemini
      const embedding = await generateEmbedding(chunkText);
      
      // 2. Lo guardamos en la base de datos Supabase
      const savedData = await save(chunkText, embedding, sourceFile, i);
      
      savedChunks.push(savedData);
    }
    
    return savedChunks;
  } catch (error) {
    console.error(' Error procesando el documento:', error);
    throw error; // Lanzamos el error para que el controlador lo ataje
  }
};

module.exports = { processAndSaveDocument };