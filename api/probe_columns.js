const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lpqhttzjeynnluaeejdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcWh0dHpqZXlubmx1YWVlamRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0NTEzNCwiZXhwIjoyMDk0NDIxMTM0fQ.y4ln5XFrTYAumGc0O2ogp7HBf_3Qttn5z6r6Wbter9o';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function probe() {
  const testId = 'probe-' + Date.now();
  
  const variations = [
    { influencername: 'v1', productid: 'v1' },
    { influencer_name: 'v2', product_id: 'v2' },
    { "influencerName": 'v3', "productId": 'v3' }
  ];

  for (const v of variations) {
    console.log('--- Testando variação:', JSON.stringify(v));
    const { error } = await supabase.from('lookbook').insert([{ id: testId + Math.random(), image: 'test', ...v }]);
    if (!error) {
      console.log('✅ FUNCIONOU com:', JSON.stringify(v));
      return;
    } else {
      console.log('❌ FALHOU:', error.message);
    }
  }
}

probe();
