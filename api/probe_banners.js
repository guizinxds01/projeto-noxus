const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lpqhttzjeynnluaeejdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcWh0dHpqZXlubmx1YWVlamRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0NTEzNCwiZXhwIjoyMDk0NDIxMTM0fQ.y4ln5XFrTYAumGc0O2ogp7HBf_3Qttn5z6r6Wbter9o';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function probeBanners() {
  console.log('🔍 Checando colunas da tabela banners...');
  const { data, error } = await supabase.from('banners').select('*').limit(1);
  if (data && data.length > 0) {
    console.log('✅ Colunas encontradas:', Object.keys(data[0]));
  } else {
    // Tenta inserção cega com minúsculas
    const { error: err } = await supabase.from('banners').insert([{ id: 'test-b', buttontext: 'test', buttonlink: 'test' }]);
    if (!err) console.log('✅ Minúsculas funcionam para buttontext/buttonlink');
    else console.log('❌ Erro banners:', err.message);
  }
}

probeBanners();
