const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lpqhttzjeynnluaeejdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcWh0dHpqZXlubmx1YWVlamRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0NTEzNCwiZXhwIjoyMDk0NDIxMTM0fQ.y4ln5XFrTYAumGc0O2ogp7HBf_3Qttn5z6r6Wbter9o';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSave() {
  console.log('--- TESTE DE SALVAMENTO NOXUS ---');
  const testId = 'test-' + Date.now();
  const { data, error } = await supabase
    .from('lookbook')
    .insert([{ 
      id: testId, 
      image: 'https://placehold.co/600x800?text=Teste+Noxus', 
      influencername: 'Teste IA Lower',
      ord: 99
    }]);

  if (error) {
    console.log('❌ ERRO AO SALVAR:', error.message);
    if (error.message.includes('row-level security')) {
      console.log('👉 DIAGNÓSTICO: Você precisa desativar o RLS no painel do Supabase.');
    }
  } else {
    console.log('✅ SUCESSO! O registro foi salvo no banco.');
    console.log('Agora verifique sua tabela "lookbook" no site, o registro "Teste IA" deve estar lá.');
  }
}

testSave();
