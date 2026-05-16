const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lpqhttzjeynnluaeejdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcWh0dHpqZXlubmx1YWVlamRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0NTEzNCwiZXhwIjoyMDk0NDIxMTM0fQ.y4ln5XFrTYAumGc0O2ogp7HBf_3Qttn5z6r6Wbter9o';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSchema() {
  console.log('🔍 Checando colunas da tabela lookbook...');
  // Tenta pegar um registro para ver as chaves
  const { data, error } = await supabase.from('lookbook').select('*').limit(1);
  if (error) {
    console.log('❌ Erro:', error.message);
  } else if (data && data.length > 0) {
    console.log('✅ Colunas encontradas:', Object.keys(data[0]));
  } else {
    console.log('⚠️ Tabela vazia. Vou tentar listar via RPC ou query de sistema.');
    // Fallback: tentar inserir algo muito simples sem colunas extras
    const { error: insError } = await supabase.from('lookbook').insert([{ id: 'check-' + Date.now(), image: 'test' }]);
    if (insError) console.log('❌ Erro no insert simples:', insError.message);
    else console.log('✅ Insert simples funcionou. O problema são os nomes das outras colunas.');
  }
}

checkSchema();
