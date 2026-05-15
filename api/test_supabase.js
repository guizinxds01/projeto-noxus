const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lpqhttzjeynnluaeejdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcWh0dHpqZXlubmx1YWVlamRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0NTEzNCwiZXhwIjoyMDk0NDIxMTM0fQ.y4ln5XFrTYAumGc0O2ogp7HBf_3Qttn5z6r6Wbter9o';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log('🔍 Testando conexão com Supabase...');
  try {
    const { data, error } = await supabase.from('config').select('*');
    if (error) {
      console.error('❌ Erro na Query:', error.message);
      return;
    }
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('📊 Dados encontrados na tabela config:', data);
    
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    console.log(`📦 Total de produtos no Supabase: ${count || 0}`);
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err.message);
  }
}

test();
