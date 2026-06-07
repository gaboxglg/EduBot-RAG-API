const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error(' Faltan las variables de entorno de Supabase (URL o SERVICE_KEY)');
    }
    // Inicializamos el cliente con la Service Key
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return supabase;
};

module.exports = { getSupabaseClient };