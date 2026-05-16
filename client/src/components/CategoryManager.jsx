import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Upload, ImageOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState({ name: '', image: '', parent_id: null });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories((data || []).map(c => ({ ...c, _id: c.id })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setCurrent({ name: '', image: '', parent_id: null }); setIsEditing(true); };
  const openEdit = (c) => { setCurrent({ ...c, parent_id: c.parent_id || null }); setIsEditing(true); };
  const cancel = () => { setCurrent({ name: '', image: '', parent_id: null }); setIsEditing(false); };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `cat-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      setCurrent(prev => ({ ...prev, image: publicUrl }));
    } catch (e) { alert('Erro ao enviar imagem: ' + e.message); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!current.name.trim()) { alert('Digite o nome da categoria.'); return; }
    setSaving(true);
    try {
      const saveObj = {
        name: current.name,
        image: current.image,
        parent_id: current.parent_id || null
      };
      if (current._id) saveObj.id = current._id;
      const { error } = await supabase.from('categories').upsert([saveObj]);
      if (error) throw error;
      await load();
      cancel();
    } catch (e) { alert('Erro: ' + e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta categoria?')) return;
    await supabase.from('categories').delete().eq('id', id);
    await load();
  };

  if (!isEditing) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black uppercase tracking-widest italic text-white">Gerenciar Categorias</h2>
        <button onClick={openNew} className="bg-[#00ff88] text-black px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
          <Plus size={16} /> Nova Categoria
        </button>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <th className="px-6 py-5">Foto</th>
              <th className="px-6 py-5">Nome</th>
              <th className="px-6 py-5">Categoria Pai</th>
              <th className="px-6 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-16 text-center text-gray-600 text-sm">Nenhuma categoria cadastrada.</td></tr>
            )}
            {categories.map(c => (
              <tr key={c._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="w-14 h-14 rounded-full border-2 border-white/10 overflow-hidden bg-[#111] flex items-center justify-center flex-shrink-0">
                    {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <span className="text-xl font-black italic text-white/30">{c.name?.[0]?.toUpperCase()}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 font-black uppercase italic tracking-tight text-white text-lg">{c.name}</td>
                <td className="px-6 py-4">{c.parent_id ? categories.find(cat => cat._id === c.parent_id)?.name : 'Principal'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(c)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-2 bg-white/5 rounded-lg text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] rounded-3xl p-10 border border-white/5 max-w-xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{current._id ? 'Editar Categoria' : 'Nova Categoria'}</h3>
        <button onClick={cancel} className="text-gray-500 hover:text-white"><X /></button>
      </div>
      <div className="space-y-6">
        <input type="text" value={current.name} onChange={e => setCurrent(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50 text-lg" placeholder="Nome da Categoria" />
        <select value={current.parent_id || ''} onChange={e => setCurrent(p => ({ ...p, parent_id: e.target.value || null }))} className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50 text-lg">
          <option value="">Principal</option>
          {categories.filter(c => !c.parent_id && c._id !== current._id).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <label className="flex items-center justify-center gap-2 border border-dashed rounded-2xl px-4 py-4 cursor-pointer border-white/10 hover:border-[#00ff88]/50 transition-all">
          <Upload size={18} className="text-gray-500" />
          <span className="text-sm font-bold text-gray-400">{uploading ? 'Enviando...' : 'Selecionar Foto'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
        <button onClick={handleSave} disabled={saving || uploading} className="w-full bg-[#00ff88] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all">
          {saving ? 'Salvando...' : 'Salvar Categoria'}
        </button>
      </div>
    </div>
  );
};

export default CategoryManager;
