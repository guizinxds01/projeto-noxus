const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');

const db = new Database('noxus.db');
const SUPABASE_URL = 'https://lpqhttzjeynnluaeejdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcWh0dHpqZXlubmx1YWVlamRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0NTEzNCwiZXhwIjoyMDk0NDIxMTM0fQ.y4ln5XFrTYAumGc0O2ogp7HBf_3Qttn5z6r6Wbter9o';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
  console.log('🚀 Iniciando Grande Migração: SQLite -> Supabase Cloud');

  try {
    // 1. Config
    console.log('⚙️ Migrando Configurações...');
    const config = db.prepare('SELECT * FROM config').all();
    if (config.length > 0) {
      const entries = config.map(c => ({ key: c.key, value: String(c.value) }));
      await supabase.from('config').upsert(entries);
    }

    // 2. Categorias
    console.log('📂 Migrando Categorias...');
    const categories = db.prepare('SELECT * FROM categories').all();
    if (categories.length > 0) {
      const catData = categories.map(c => ({ 
        id: String(c.id || c._id), 
        name: c.name, 
        image: c.image || '', 
        parent_id: c.parent_id 
      }));
      await supabase.from('categories').upsert(catData);
    }

    // 3. Produtos
    console.log('📦 Migrando Produtos...');
    const products = db.prepare('SELECT * FROM products').all();
    if (products.length > 0) {
      const prodData = products.map(p => ({
        id: String(p.id || p._id),
        name: p.name,
        price: String(p.price),
        description: p.description || '',
        category: p.category || '',
        images: JSON.parse(p.images || '[]'),
        sizes: JSON.parse(p.sizes || '[]'),
        status: p.status || 'ativo',
        clicks: p.clicks || 0,
        is_featured: !!(p.isFeatured || p.is_featured),
        on_offer: !!(p.onOffer || p.on_offer),
        views_count: Number(p.viewsCount || p.views_count || 0)
      }));
      await supabase.from('products').upsert(prodData);
    }

    // 4. Banners
    console.log('🖼️ Migrando Banners...');
    const banners = db.prepare('SELECT * FROM banners').all();
    if (banners.length > 0) {
      const banData = banners.map(b => ({
        id: String(b.id || b._id),
        title: b.title || '',
        subtitle: b.subtitle || '',
        image: b.image || '',
        buttonText: b.buttonText || '',
        buttonLink: b.buttonLink || '#catalog',
        status: !!b.status,
        ord: b.order || b.ord || 0
      }));
      await supabase.from('banners').upsert(banData);
    }

    // 5. Lookbook
    console.log('🤳 Migrando Lookbook...');
    const lookbook = db.prepare('SELECT * FROM lookbook').all();
    if (lookbook.length > 0) {
      const lbData = lookbook.map(l => ({
        id: String(l.id || l._id),
        image: l.image,
        influencerName: l.influencerName || '',
        productId: l.productId || '',
        ord: l.ord || 0
      }));
      await supabase.from('lookbook').upsert(lbData);
    }

    console.log('\n✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('Seus dados agora estão seguros na nuvem do Supabase.');

  } catch (err) {
    console.error('❌ Erro durante a migração:', err.message);
    console.log('\nDica: Verifique se as tabelas foram criadas no Supabase com a query que te passei.');
  }
}

migrate();
