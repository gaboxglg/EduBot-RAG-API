const { generateEmbedding } = require('./embedding.service');
const { findSimilar } = require('../repositories/document.repository');

const askQuestion = async (question) => {
    // 1. Vectorizamos y buscamos
    const queryEmbedding = await generateEmbedding(question);
    const contextDocs = await findSimilar(queryEmbedding);
    const contextText = contextDocs.map(doc => doc.content).join('\n');
    
    const prompt = `Usando el siguiente contexto, responde a la pregunta. 
    Si no sabes la respuesta basándote en el contexto, di que no lo sabes.
    
    Contexto: ${contextText}
    Pregunta: ${question}`;
    
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    
    const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const modelsRes = await fetch(modelsUrl);
    const modelsData = await modelsRes.json();
    
    if (!modelsRes.ok) throw new Error('Error al conectar con la API de Google.');

    const textModel = modelsData.models.find(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent') &&
        (m.name.includes('flash') || m.name.includes('pro'))
    );

    if (!textModel) throw new Error('No hay modelos de texto habilitados.');

    console.log('✅ Modelo detectado:', textModel.name);


    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${textModel.name}:generateContent?key=${apiKey}`;
    
    
    let response;
    let attempts = 0;
    
    while (attempts < 3) {
        response = await fetch(generateUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (response.status === 503) {
            attempts++;
            console.log(`⚠️ Modelo saturado, reintentando (${attempts}/3)...`);
            await new Promise(r => setTimeout(r, 2000));
        } else {
            break;
        }
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Error al generar la respuesta.');
    }
    
    return data.candidates[0].content.parts[0].text;
};

module.exports = { askQuestion };