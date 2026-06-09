const { getSupabaseClient } = require('../config/supabase');

const save = async (content, embedding, sourceFile, chunkIndex) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        content,
        embedding,
        source_file: sourceFile,
        chunk_index: chunkIndex
      }
    ])
    .select();

  if (error) {
    console.error(' Error guardando en Supabase:', error);
    throw error;
  }
  return data;
};

const findSimilar = async (queryEmbedding, matchThreshold = 0.75, matchCount = 3) => {
  const supabase = getSupabaseClient();

  // Llamamos a la función que creaste en SQL en Supabase
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount
  });

  if (error) {
    console.error(' Error buscando en Supabase:', error);
    throw error;
  }
  return data || [];
};

module.exports = { save, findSimilar };