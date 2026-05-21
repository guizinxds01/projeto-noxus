const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Variáveis Supabase ausentes no .env!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  console.log("=== DIAGNÓSTICO DE CATEGORIAS E PRODUTOS ===\n");
  
  // Buscar todas as categorias
  const { data: categories, error: catErr } = await supabase.from('categories').select('*').order('name');
  if (catErr) {
    console.error("Erro ao buscar categorias:", catErr);
  } else {
    console.log(`Categorias encontradas (${categories.length}):`);
    categories.forEach(c => {
      console.log(`- ID: ${c.id} | Nome: "${c.name}" | Parent_ID: ${c.parent_id || 'Nenhum'}`);
    });
  }
  
  console.log("\n------------------------------------------------\n");
  
  // Buscar todos os produtos
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  if (prodErr) {
    console.error("Erro ao buscar produtos:", prodErr);
  } else {
    console.log(`Produtos encontrados (${products.length}):`);
    const catMap = {};
    products.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });
    
    console.log("\nQuantidade de produtos por categoria cadastrada no produto:");
    Object.entries(catMap).forEach(([catName, count]) => {
      console.log(`- Categoria "${catName}": ${count} produtos`);
    });

    console.log("\nProdutos listados:");
    products.forEach(p => {
      console.log(`- Nome: "${p.name}" | Categoria associada: "${p.category}" | Status: "${p.status}"`);
    });
  }
}

check();
