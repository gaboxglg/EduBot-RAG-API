const { generateEmbedding } = require('./embedding.service');
const { findSimilar } = require('../repositories/document.repository');
const { getGeminiClient } = require('./ai.factory');

const askQuestion = async (question) => {
  // 1. Convertimos tu pregunta a vector
  const queryEmbedding = await generateEmbedding(question);
  
  // 2. Buscamos en Supabase los documentos más parecidos (RAG)
  const contextDocs = await findSimilar(queryEmbedding);
  
  // 3. Juntamos todo el texto recuperado para darle contexto a Gemini
  const contextText = contextDocs.map(doc => doc.content).join('\n');
  
  // 4. Le pedimos a Gemini que responda usando ese contexto
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Usando el siguiente contexto, responde a la pregunta. 
  Si no sabes la respuesta basándote en el contexto, di que no lo sabes.
  Contexto: ${contextText}
  Pregunta: ${question}`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { askQuestion };