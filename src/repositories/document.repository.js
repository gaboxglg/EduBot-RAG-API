const { getSupabaseClient } = require('../config/supabase');

// Función matemática para calcular la similitud vectorial
const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += Math.pow(vecA[i], 2);
        normB += Math.pow(vecB[i], 2);
    }
    
    // Evitamos retornar 0 o null. Si hay error matemático, retornamos -1.
    if (normA === 0 || normB === 0) return -1; 
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const findSimilar = async (queryEmbedding, matchThreshold = 0.75, matchCount = 3) => {
    const supabase = getSupabaseClient();

    const { data: documents, error } = await supabase
        .from('documents')
        .select('id, content, embedding, source_file, chunk_index');

    if (error) {
        console.error(' ERROR AL TRAER DOCS:', error);
        throw error;
    }

    // 2. Comparamos los vectores acá en tu servidor
    const resultados = documents.map(doc => {
        let docEmbedding = doc.embedding;
      
        
        if (!docEmbedding) {
            return { ...doc, similarity: -1 };
        }
        

        if (typeof docEmbedding === 'string') {
            docEmbedding = JSON.parse(docEmbedding);
        }

        const similitud = cosineSimilarity(queryEmbedding, docEmbedding);
        return { ...doc, similarity: similitud };
    });

   
    const mejores = resultados
        .filter(doc => doc.similarity > matchThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, matchCount);

    return mejores.length > 0 ? mejores : []; 
};

module.exports = { findSimilar };