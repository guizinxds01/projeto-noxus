import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, X, Eye, EyeOff } from 'lucide-react';
import ImageCropper from './ImageCropper';
import { supabase } from '../lib/supabase';

const emptyBanner = { title: '', subtitle: '', image: '', buttonText: '', buttonLink: '#catalog', status: true, order: 0 };

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(emptyBanner);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const load = async () => {
    try {
      const { data } = await supabase.from('banners').select('*').order('ord');
      setBanners((data || []).map(b => ({ ...b, _id: b.id, order: b.ord, status: !!b.status })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setCurrent(emptyBanner); setIsEditing(true); };
  const openEdit = (b) => { setCurrent(b); setIsEditing(true); };
  const cancel = () => { setCurrent(emptyBanner); setIsEditing(false); };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setTempImage(reader.result); setShowCropper(true); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (blob) => {
    setShowCropper(false);
    setUploading(true);
    try {
      const fileName = `banner-${Math.random().toString(36).slice(2)}.jpg`;
      const { error } = await supabase.storage.from('products').upload(fileName, blob);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      setCurrent(prev => ({ ...prev, image: publicUrl }));
    } catch (e) { alert('Erro ao enviar imagem: ' + e.message); }
    setUploading(false);
    setTempImage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saveObj = {
        title: current.title,
        subtitle: current.subtitle,
        image: current.image,
        buttonText: current.buttonText,
        buttonLink: current.buttonLink || '#catalog',
        status: !!current.status,
        ord: Number(current.order) || 0
      };

      if (current._id) saveObj.id = current._id;

      const { error } = await supabase.from('banners').upsert([saveObj]);
      if (error) throw error;
      
      await load();
      cancel();
    } catch (e) { alert('Erro ao salvar banner: ' + e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este banner?')) return;
    await supabase.from('banners').delete().eq('id', id);
    await load();
  };

  const toggleStatus = async (b) => {
    await supabase.from('banners').update({ status: !b.status }).eq('id', b._id);
    await load();
  };

  if (!isEditing) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black uppercase tracking-widest italic text-white">Gerenciar Banners</h2>
        <button onClick={openNew} className="bg-[#00ff88] text-black px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
          <Plus size={16} /> Novo Banner
        </button>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <th className="px-6 py-5">Banner</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5 text-center">Ordem</th>
              <th className="px-6 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-16 text-center text-gray-600 text-sm">Nenhum banner cadastrado.</td></tr>
            )}
            {banners.map(b => (
              <tr key={b._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                      {b.image ? <img src={b.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-white/5" />}
                    </div>
                    <span className="font-bold text-sm text-white">{b.title || <span className="text-gray-600 italic">Sem título</span>}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${b.status ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-red-500/10 text-red-500'}`}>
                    {b.status ? 'ATIVO' : 'INATIVO'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm font-bold text-gray-400">{b.order ?? 0}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggleStatus(b)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Alternar status">
                      {b.status ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => openEdit(b)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="p-2 bg-white/5 rounded-lg text-red-500/40 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
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
    <>
      <div className="bg-[#0a0a0a] rounded-3xl p-10 border border-white/5 max-w-4xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white">
            {current._id ? 'Editar Banner' : 'Novo Banner'}
          </h3>
          <button onClick={cancel} className="text-gray-500 hover:text-white"><X /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Título</label>
              <input type="text" value={current.title} onChange={e => setCurrent(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Subtítulo</label>
              <input type="text" value={current.subtitle} onChange={e => setCurrent(p => ({ ...p, subtitle: e.target.value }))}
                className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Texto do Botão</label>
                <input type="text" value={current.buttonText} onChange={e => setCurrent(p => ({ ...p, buttonText: e.target.value }))}
                  className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Ordem</label>
                <input type="number" value={current.order} onChange={e => setCurrent(p => ({ ...p, order: e.target.value }))}
                  className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl outline-none font-bold text-white focus:border-[#00ff88]/50" />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Imagem do Banner</label>
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 cursor-pointer transition-all bg-[#111] ${uploading ? 'border-[#00ff88]/50 opacity-60' : 'border-white/10 hover:border-[#00ff88]/50'}`}>
                <Upload className="text-gray-500 mb-2" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {uploading ? 'Enviando...' : 'Selecionar Imagem'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
              {current.image && (
                <div className="mt-4 aspect-[16/7] rounded-2xl overflow-hidden border border-white/10">
                  <img src={current.image} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full bg-[#00ff88] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50">
              {saving ? 'Salvando...' : 'Salvar Banner'}
            </button>
          </div>
        </div>
      </div>

      {showCropper && (
        <ImageCropper
          image={tempImage}
          aspect={16/7}
          onCropComplete={handleCropComplete}
          onCancel={() => { setShowCropper(false); setTempImage(null); }}
        />
      )}
    </>
  );
};

export default BannerManager;
