const { verifyToken } = require('../middlewares/auth.middleware');
const express = require('express');
const { askQuestion } = require('../services/chat.service');

const router = express.Router();

router.post('/ask', verifyToken, async (req, res) => {
        try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Falta enviar la pregunta.' });
        }

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