const generateEmbedding = async (text) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const modelName = "gemini-embedding-001";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:embedContent?key=${apiKey}`;
        
        const cleanText = text.replace(/\n/g, ' ');

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: { parts: [{ text: cleanText }] }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Error desconocido de Google');
        }

        if (data.embedding && data.embedding.values) {
            return data.embedding.values;
        } else if (data.embedding) {
            return data.embedding;
        } else {
            return []; // Devolvemos array vacío en vez de null si algo falla
        }
    } catch (error) {
        console.error(' Error en embedding:', error.message);
        throw new Error('No se pudo generar el vector del texto.');
    }
};

module.exports = { generateEmbedding };