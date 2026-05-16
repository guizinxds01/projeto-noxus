import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, X, Search, Star, Eye, Copy, Video } from 'lucide-react';
import MediaRenderer from './MediaRenderer';

import { supabase } from '../lib/supabase';

const emptyProduct = { name: '', price: '', description: '', category: '', images: [], sizes: [], status: 'ativo', isFeatured: false, onOffer: false, viewsCount: 0 };

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(emptyProduct);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

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

  const loadProducts = async () => {
    try {
      const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
      setProducts((data || []).map(parseProduct));
    } catch (e) { console.error(e); }
  };

  const loadCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories((data || []).map(c => ({ _id: c.id, ...c })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadProducts(); loadCategories(); }, []);

  const openNew = () => { setCurrent(emptyProduct); setIsEditing(true); };
  const openEdit = (p) => { setCurrent(p); setIsEditing(true); };
  const cancel = () => { setCurrent(emptyProduct); setIsEditing(false); };

  // Auto-Categorização Inteligente
  useEffect(() => {
    if (!isEditing || !current.name || current.category) return;
    const nameLower = current.name.toLowerCase();
    const sortedCats = [...categories].sort((a, b) => b.name.length - a.name.length);
    for (const cat of sortedCats) {
      if (nameLower.includes(cat.name.toLowerCase())) {
        setCurrent(prev => ({ ...prev, category: cat.name }));
        break;
      }
    }
  }, [current.name, categories, isEditing]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (error) {
        alert('Erro no upload: ' + error.message);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setCurrent(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
    }
  };

  const handleSave = async () => {
    if (!current.name || !current.price) { alert('Preencha pelo menos o nome e preço.'); return; }
    setSaving(true);
    try {
      const saveObj = {
        name: current.name,
        price: String(current.price),
        description: current.description,
        category: current.category,
        images: current.images,
        sizes: current.sizes,
        status: current.status,
        is_featured: !!current.isFeatured,
        on_offer: !!current.onOffer,
        views_count: Number(current.viewsCount)
      };

      if (current._id) {
        saveObj.id = current._id;
      } else {
        saveObj.id = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
      }

      const { error } = await supabase.from('products').upsert([saveObj]);
      if (error) throw error;
      
      await loadProducts();
      cancel();
    } catch (e) { alert('Erro ao salvar: ' + e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este produto?')) return;
    await supabase.from('products').delete().eq('id', id);
    await loadProducts();
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  // ── LIST VIEW ──
  if (!isEditing) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black uppercase tracking-widest italic text-white">Gerenciar Produtos</h2>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input type="text" placeholder="Buscar produtos..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-[#00ff88] outline-none" />
          </div>
          <button onClick={openNew} className="bg-[#00ff88] text-black px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
            <Plus size={16} /> Novo Produto
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <th className="px-6 py-5">Nome</th>
              <th className="px-6 py-5">Categoria</th>
              <th className="px-6 py-5">Preço</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5 text-center">Viwes</th>
              <th className="px-6 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-600 text-sm">Nenhum produto cadastrado.</td></tr>
            )}
            {filtered.map(p => (
              <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Star size={14} className={p.clicks > 10 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'} />
                    <div className="flex gap-1 absolute -top-1 -left-1 z-10">
                      {p.isFeatured && <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-yellow-500/20"><Star size={8} fill="currentColor" /></div>}
                      {p.onOffer && <div className="w-4 h-4 bg-[#00ff88] rounded-full flex items-center justify-center text-black shadow-lg shadow-[#00ff88]/20 font-black text-[8px]">%</div>}
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#111] overflow-hidden border border-white/5 flex-shrink-0">
                      {p.images?.[0] && <MediaRenderer url={p.images[0]} className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-bold text-sm text-white tracking-tight">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-widest">{p.category}</td>
                <td className="px-6 py-4 text-sm font-black text-[#00ff88]">R$ {p.price}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.status === 'ativo' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-red-500/10 text-red-500'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-[10px] font-black text-gray-400">
                    {p.viewsCount || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 bg-white/5 rounded-lg text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── EDIT / CREATE VIEW ──
  return (
    <div className="bg-[#0a0a0a] rounded-3xl p-10 border border-white/5">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{current._id ? 'Editar Produto' : 'Novo Produto'}</h3>
        <button onClick={cancel} className="text-gray-500 hover:text-white"><X /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Nome do Produto</label>
            <input type="text" value={current.name} onChange={e => setCurrent(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Preço (R$)</label>
              <input type="number" value={current.price} onChange={e => setCurrent(p => ({ ...p, price: e.target.value }))}
                className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Categoria</label>
              <select value={current.category} onChange={e => setCurrent(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50">
                <option value="">Selecionar...</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Descrição</label>
            <textarea value={current.description} onChange={e => setCurrent(p => ({ ...p, description: e.target.value }))}
              className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50 h-28" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Tamanhos</label>
            <input type="text" value={current.sizes.join(', ')}
              onChange={e => setCurrent(p => ({ ...p, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              placeholder="P, M, G ou 38, 39, 40..."
              className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50" />
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setCurrent(p => ({ ...p, sizes: ['P', 'M', 'G', 'GG'] }))} className="px-3 py-1.5 bg-white/5 text-[9px] font-black uppercase rounded-lg hover:bg-white/10 text-gray-400">Roupas</button>
              <button type="button" onClick={() => setCurrent(p => ({ ...p, sizes: ['38', '39', '40', '41', '42', '43'] }))} className="px-3 py-1.5 bg-white/5 text-[9px] font-black uppercase rounded-lg hover:bg-white/10 text-gray-400">Calçados</button>
              <button type="button" onClick={() => setCurrent(p => ({ ...p, sizes: [] }))} className="px-3 py-1.5 bg-white/5 text-[9px] font-black uppercase rounded-lg hover:bg-red-500/10 text-red-500/60">Limpar</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Status</label>
              <select value={current.status} onChange={e => setCurrent(p => ({ ...p, status: e.target.value }))}
                className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className="flex flex-col justify-end gap-3 pb-1">
              <div 
                onClick={() => setCurrent(p => ({ ...p, isFeatured: !p.isFeatured }))}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${current.isFeatured ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'bg-white/5'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${current.isFeatured ? 'left-6' : 'left-1'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${current.isFeatured ? 'text-yellow-500' : 'text-gray-500 group-hover:text-white'}`}>Destaque</span>
              </div>

              <div 
                onClick={() => setCurrent(p => ({ ...p, onOffer: !p.onOffer }))}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${current.onOffer ? 'bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.4)]' : 'bg-white/5'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${current.onOffer ? 'left-6' : 'left-1'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${current.onOffer ? 'text-[#00ff88]' : 'text-gray-500 group-hover:text-white'}`}>Oferta</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block italic">🔥 Visualizações (Fake)</label>
              <input type="number" value={current.viewsCount} onChange={e => setCurrent(p => ({ ...p, viewsCount: e.target.value }))}
                className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Fotos do Produto</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-8 hover:border-[#00ff88]/50 cursor-pointer transition-all bg-[#111]">
              <Upload className="text-gray-500 mb-2" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center px-4">Enviar Mídia (Imagens ou Vídeos)</span>
              <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleUpload} />
            </label>
            {current.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {current.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                    <MediaRenderer url={img} className="w-full h-full object-cover" />
                    <button onClick={() => setCurrent(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"><X size={10} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-[#00ff88] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
