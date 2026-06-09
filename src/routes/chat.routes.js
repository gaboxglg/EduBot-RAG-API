const express = require('express');
const { askQuestion } = require('../services/chat.service');

const router = express.Router();

router.post('/ask', async (req, res) => {
  try {
    // Agarramos la pregunta que nos mandás desde Postman
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Falta enviar la pregunta.' });
    }

    // Le pasamos la pregunta al servicio que creaste recién
    const answer = await askQuestion(question);

    res.status(200).json({
      pregunta: question,
      respuesta: answer
    });

  } catch (error) {
    console.error(' Error en la ruta de chat:', error);
    res.status(500).json({ error: 'Error interno al procesar la pregunta.' });
  }
});

module.exports = router;