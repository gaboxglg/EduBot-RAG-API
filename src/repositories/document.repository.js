import { getSupabaseClient } from '../config/supabase.js';

/**
 * Calcula la similitud de coseno entre dos vectores (Embeddings).
 * Compara matemáticamente qué tan cerca están los conceptos en el espacio vectorial.
 * @param {Array<number>} vecA - Vector de la consulta del usuario
 * @param {Array<number>} vecB - Vector del documento en base de datos
 * @returns {number} Valor de similitud (más cerca a 1 es más similar)
 */
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

// Cambiamos el 0.75 por defecto a 0.2
export const findSimilar = async (queryEmbedding, matchThreshold = 0.2, matchCount = 3) => {
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

export const save = async (text, embedding, sourceFile, chunkIndex) => {
    const supabase = getSupabaseClient();
    
    const embeddingArray = Array.isArray(embedding) ? embedding : JSON.parse(embedding);

    const { data, error } = await supabase
        .from('documents') 
        .insert({
            content: text,
            embedding: embeddingArray,
            source_file: sourceFile,
            chunk_index: chunkIndex
        })
        .select('*'); 

    if (error) {
        console.error('ERROR CRITICO AL INSERTAR:', JSON.stringify(error, null, 2));
        throw error;
    }
    return data;
};

// --- NUEVAS FUNCIONES CRUD ---

export const getAllDocuments = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('documents')
        .select('id, content, source_file, chunk_index'); 

    if (error) throw error;
    return data || [];
};

export const updateDocument = async (id, newContent) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('documents')
        .update({ content: newContent })
        .eq('id', id)
        .select();

    if (error) throw error;
    return data || [];
};

export const deleteDocument = async (id) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .select();

    if (error) throw error;
    return data || [];
};