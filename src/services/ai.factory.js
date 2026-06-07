const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(' Falta la GEMINI_API_KEY en el archivo .env');
  }
  // Inicializamos el cliente de Google Gemini
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

module.exports = { getGeminiClient }