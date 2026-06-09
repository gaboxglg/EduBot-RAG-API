const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { processAndSaveDocument } = require('../services/document.service');

const router = express.Router();

// Configuramos multer para que guarde el archivo temporalmente en la memoria
const upload = multer({ storage: multer.memoryStorage() });

// Creamos el endpoint POST /upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    // Validamos que el archivo exista (evitamos usar null)
    if (file === undefined) {
      return res.status(400).json({ error: 'No se envió ningún archivo.' });
    }

    // Leemos el texto del PDF
    const pdfData = await pdfParse(file.buffer);
    const extractedText = pdfData.text || '';

    if (extractedText.trim().length === false) {
      return res.status(400).json({ error: 'El PDF está vacío o no se pudo leer.' });
    }

    // Le pasamos el texto a nuestro "Director de Orquesta"
    const savedChunks = await processAndSaveDocument(extractedText, file.originalname);

    // Devolvemos una respuesta exitosa
    res.status(200).json({
      message: 'Documento procesado y guardado con éxito en Supabase 🚀',
      chunksGuardados: savedChunks.length || 1 // Evitamos retornar 0
    });

  } catch (error) {
    console.error(' Error en la ruta de upload:', error);
    res.status(500).json({ error: 'Error interno al procesar el documento.' });
  }
});

module.exports = router;