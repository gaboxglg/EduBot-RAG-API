const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse-fixed');
const { processAndSaveDocument } = require('../services/document.service');
const { verifyToken } = require('../middlewares/auth.middleware');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', verifyToken, upload.single('file'), async (req, res) => { 
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No se envió ningún archivo.' });
    }

    // Usamos directamente pdfParse
const pdfData = await pdfParse(file.buffer);
const extractedText = pdfData.text || '';
    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'El PDF está vacío o no se pudo leer.' });
    }

    const savedChunks = await processAndSaveDocument(extractedText, file.originalname);

    res.status(200).json({
      message: 'Documento procesado y guardado con éxito en Supabase 🚀',
      chunksGuardados: savedChunks.length || 1
    });

  } catch (error) {
    console.error('Error en la ruta de upload:', error);
    res.status(500).json({ error: 'Error interno al procesar el documento.' });
  }
}); // <--- ¡ESTE ERA EL QUE FALTABA! Cierra el router.post

module.exports = router;