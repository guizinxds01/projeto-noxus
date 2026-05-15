const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CONFIGURAÇÃO SUPABASE ───────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── PROTOCOLO DE BLINDAGEM (BACKUP LOCAL) ───────────────────────────────────
const BACKUP_PATH = path.join(__dirname, 'backup_catalogo.json');

const saveLocalBackup = async () => {
  try {
    const { data: products } = await supabase.from('products').select('*');
    const { data: categories } = await supabase.from('categories').select('*');
    const { data: config } = await supabase.from('config').select('*');
    const { data: banners } = await supabase.from('banners').select('*');
    const { data: lookbook } = await supabase.from('lookbook').select('*');
    const { data: orders } = await supabase.from('orders').select('*');

    const backupData = { 
      products, categories, config, banners, lookbook, orders,
      timestamp: new Date().toISOString() 
    };
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(backupData, null, 2));
    console.log('💾 Backup local de segurança atualizado (Sincronizado com Nuvem).');
  } catch (e) {
    console.error('❌ Erro ao gerar backup local:', e);
  }
};

// Migração Automática: Local -> Supabase
const migrateToSupabase = async () => {
  if (!fs.existsSync(BACKUP_PATH)) return;

  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  if (count > 0) return; // Se já tem dados, não migra

  console.log('🛡️ Banco Supabase vazio! Iniciando migração do Cofre Local para a Nuvem...');
  try {
    const data = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
    
    if (data.config) await supabase.from('config').upsert(data.config);
    if (data.categories) await supabase.from('categories').insert(data.categories);
    if (data.products) await supabase.from('products').insert(data.products);
    if (data.banners) await supabase.from('banners').insert(data.banners);
    if (data.lookbook) await supabase.from('lookbook').insert(data.lookbook);
    if (data.orders) await supabase.from('orders').insert(data.orders);

    console.log('✅ Migração para Supabase concluída com sucesso!');
  } catch (e) {
    console.error('❌ Falha na migração:', e);
  }
};

migrateToSupabase();

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const parseProduct = (p) => {
  if (!p) return null;
  return {
    _id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    category: p.category,
    images: Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]'),
    sizes: Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || '[]'),
    status: p.status,
    clicks: p.clicks || 0,
    isFeatured: !!p.is_featured,
    onOffer: !!p.on_offer,
    viewsCount: p.views_count || 0
  };
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// ─── UPLOAD ───────────────────────────────────────────────────────────────────
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const { data: admin } = await supabase.from('admins').select('*').eq('username', username).eq('password', password).single();
  
  if (admin) {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ error: 'Usuário ou senha incorretos' });
  }
});

// ─── CONFIG ───────────────────────────────────────────────────────────────────
app.get('/api/config', async (req, res) => {
  const { data } = await supabase.from('config').select('*');
  const config = {};
  data?.forEach(r => { config[r.key] = r.value; });
  res.json(config);
});

app.put('/api/config', async (req, res) => {
  const entries = Object.entries(req.body).map(([key, value]) => ({ key, value: String(value) }));
  await supabase.from('config').upsert(entries);
  saveLocalBackup();
  res.json(req.body);
});

// ─── CATEGORIAS ───────────────────────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  const { data } = await supabase.from('categories').select('*').order('name');
  res.json(data.map(c => ({ _id: c.id, name: c.name, image: c.image, parent_id: c.parent_id })));
});

app.post('/api/categories', async (req, res) => {
  const id = uid();
  const newItem = { id, ...req.body };
  const { data } = await supabase.from('categories').insert([newItem]).select().single();
  saveLocalBackup();
  res.json({ _id: data.id, ...data });
});

app.put('/api/categories/:id', async (req, res) => {
  const { data } = await supabase.from('categories').update(req.body).eq('id', req.params.id).select().single();
  saveLocalBackup();
  res.json({ _id: data.id, ...data });
});

app.delete('/api/categories/:id', async (req, res) => {
  await supabase.from('categories').delete().eq('id', req.params.id);
  saveLocalBackup();
  res.json({ success: true });
});

// ─── PRODUTOS ─────────────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
  res.json((data || []).map(parseProduct));
});

app.post('/api/products', async (req, res) => {
  const id = uid();
  const { name, price, description, category, images, sizes, status, isFeatured, onOffer, viewsCount } = req.body;
  const newItem = {
    id, name, price: String(price), description, category,
    images, sizes, status, 
    is_featured: !!isFeatured, on_offer: !!onOffer, 
    views_count: Number(viewsCount)
  };
  const { data } = await supabase.from('products').insert([newItem]).select().single();
  saveLocalBackup();
  res.json(parseProduct(data));
});

app.put('/api/products/:id', async (req, res) => {
  const { isFeatured, onOffer, viewsCount, ...rest } = req.body;
  const updateData = {
    ...rest,
    is_featured: isFeatured !== undefined ? !!isFeatured : undefined,
    on_offer: onOffer !== undefined ? !!onOffer : undefined,
    views_count: viewsCount !== undefined ? Number(viewsCount) : undefined
  };
  // Remove undefineds
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  const { data } = await supabase.from('products').update(updateData).eq('id', req.params.id).select().single();
  saveLocalBackup();
  res.json(parseProduct(data));
});

app.delete('/api/products/:id', async (req, res) => {
  await supabase.from('products').delete().eq('id', req.params.id);
  saveLocalBackup();
  res.json({ success: true });
});

// ─── BANNERS ──────────────────────────────────────────────────────────────────
app.get('/api/banners', async (req, res) => {
  const { data } = await supabase.from('banners').select('*').order('ord');
  res.json((data || []).map(b => ({ ...b, _id: b.id, status: !!b.status, order: b.ord })));
});

app.post('/api/banners', async (req, res) => {
  const id = uid();
  const { order, ...rest } = req.body;
  const { data } = await supabase.from('banners').insert([{ id, ord: order, ...rest }]).select().single();
  saveLocalBackup();
  res.json({ ...data, _id: data.id, order: data.ord });
});

app.put('/api/banners/:id', async (req, res) => {
  const { order, ...rest } = req.body;
  const updateData = { ...rest };
  if (order !== undefined) updateData.ord = order;
  const { data } = await supabase.from('banners').update(updateData).eq('id', req.params.id).select().single();
  saveLocalBackup();
  res.json({ ...data, _id: data.id, order: data.ord });
});

app.delete('/api/banners/:id', async (req, res) => {
  await supabase.from('banners').delete().eq('id', req.params.id);
  saveLocalBackup();
  res.json({ success: true });
});

// ─── LOOKBOOK ─────────────────────────────────────────────────────────────────
app.get('/api/lookbook', async (req, res) => {
  const { data } = await supabase.from('lookbook').select('*').order('ord');
  res.json(data || []);
});

app.post('/api/lookbook', async (req, res) => {
  const id = uid();
  const { data } = await supabase.from('lookbook').insert([{ id, ...req.body }]).select().single();
  saveLocalBackup();
  res.json(data);
});

app.put('/api/lookbook/:id', async (req, res) => {
  const { data } = await supabase.from('lookbook').update(req.body).eq('id', req.params.id).select().single();
  saveLocalBackup();
  res.json(data);
});

app.delete('/api/lookbook/:id', async (req, res) => {
  await supabase.from('lookbook').delete().eq('id', req.params.id);
  saveLocalBackup();
  res.json({ success: true });
});

// ─── STATS & PEDIDOS ──────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: totalCategories } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { data: prods } = await supabase.from('products').select('clicks');
  const totalClicks = prods?.reduce((acc, p) => acc + (p.clicks || 0), 0) || 0;
  const { data: topProducts } = await supabase.from('products').select('*').order('clicks', { ascending: false }).limit(5);
  
  res.json({ totalProducts, totalCategories, totalClicks, topProducts: (topProducts || []).map(parseProduct) });
});

app.post('/api/orders', async (req, res) => {
  const { productId } = req.body;
  const { data: product } = await supabase.from('products').select('*').eq('id', productId).single();
  if (!product) return res.status(404).json({ error: 'Não encontrado' });

  await supabase.from('products').update({ clicks: (product.clicks || 0) + 1 }).eq('id', productId);
  await supabase.from('orders').insert([{
    id: uid(),
    productName: product.name,
    productId: product.id,
    date: new Date().toISOString(),
    status: 'novo'
  }]);
  saveLocalBackup();
  res.json({ success: true });
});

app.get('/api/orders', async (req, res) => {
  const { data } = await supabase.from('orders').select('*').order('date', { ascending: false });
  res.json(data || []);
});

app.listen(PORT, () => {
  console.log(`\n🚀 SERVIDOR NOXUS ATIVO (SUPABASE CLOUD)`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`☁️ DB: Supabase Online\n`);
});
