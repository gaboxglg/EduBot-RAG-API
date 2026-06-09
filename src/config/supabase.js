const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const getSupabaseClient = () => {
    if (!supabase) {
        // Volvemos a usar las variables del .env por seguridad
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_KEY;

        supabase = createClient(url, key, {
            auth: { persistSession: false },
            db: { schema: 'public' }
        });
    }
    return supabase;
};

module.exports = { getSupabaseClient };