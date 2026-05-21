const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length > 0) {
    env[key.trim()] = val.join('=').trim();
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  console.log("=== LISTA DE CATEGORIAS NO SUPABASE ===");
  const { data: categories } = await supabase.from('categories').select('*').order('name');
  categories.forEach(c => {
    console.log(`- ID: ${c.id} | Nome: "${c.name}" | Parent_ID: ${c.parent_id}`);
  });

  console.log("\n=== CONTAGEM DE PRODUTOS POR CATEGORIA ===");
  const { data: products } = await supabase.from('products').select('category');
  const counts = {};
  products.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  Object.entries(counts).forEach(([catName, count]) => {
    console.log(`- "${catName}": ${count} produtos`);
  });
}

check();
