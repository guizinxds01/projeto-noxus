import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, Camera } from 'lucide-react';
import { useConfig } from '../ConfigContext';
import MediaRenderer from './MediaRenderer';
import { supabase } from '../lib/supabase';

const emptyLook = { image: '', influencerName: '', productId: '', ord: 0 };

const LookbookManager = () => {
  const { lookbook, reloadLookbook, products: ctxProducts } = useConfig();
  const [looks, setLooks] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingLook, setEditingLook] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setLooks(lookbook || []);
  }, [lookbook]);

  useEffect(() => {
    setProducts(ctxProducts || []);
  }, [ctxProducts]);

  const handleSave = async (look) => {
    try {
      const saveObj = {
        image: look.image,
        influencername: look.influencerName || '',
        productid: look.productId || null,
        ord: Number(look.ord) || 0
      };

      if (look.id) {
        saveObj.id = look.id;
      } else {
        // Gera um ID numérico aleatório para novos registros caso a tabela não seja auto-incremento
        saveObj.id = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
      }

      console.log('DEBUG: Tentando salvar no Supabase:', saveObj);
      const { error } = await supabase.from('lookbook').upsert([saveObj]);
      
      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        throw error;
      }

      reloadLookbook();
      setEditingLook(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar modelagem: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente remover esta foto da modelagem?')) return;
    try {
      const { error } = await supabase.from('lookbook').delete().eq('id', id);
      if (error) throw error;
      reloadLookbook();
    } catch (err) {
      alert('Erro ao deletar: ' + err.message);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `look-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (error) {
        console.error('Erro no upload:', error);
        alert('Erro no upload da imagem: ' + (error.message || 'Erro desconhecido. Verifique as permissões do bucket "products" no Supabase.'));
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (editingLook) {
        setEditingLook({ ...editingLook, image: publicUrl });
      } else if (isCreating) {
        setEditingLook({ ...emptyLook, image: publicUrl });
      }
    } catch (err) {
      console.error(err);
      alert('Erro no upload: ' + err.message);
    }
    setIsUploading(false);
  };

  if (editingLook || isCreating) {
    const currentLook = editingLook || emptyLook;
    return (
      <div className="bg-[#0a0a0a] rounded-3xl p-10 border border-white/5 max-w-2xl mx-auto">
        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-8">
          {isCreating ? 'Nova Foto Modelagem' : 'Editar Foto'}
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Mídia (Imagem ou Vídeo)</label>
            {currentLook.image ? (
              <div className="relative group rounded-xl overflow-hidden mb-4 border border-white/10 aspect-[3/4] bg-black max-w-sm mx-auto">
                <MediaRenderer url={currentLook.image} alt="Look" className="w-full h-full object-cover" />
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                  <Upload size={24} className="text-white mb-2" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Trocar Mídia</span>
                  <input type="file" onChange={handleUpload} className="hidden" accept="image/*,video/*" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#00ff88]/50 hover:bg-[#00ff88]/5 transition-all aspect-[3/4] max-w-sm mx-auto">
                <Camera size={32} className="text-white/30 mb-3" />
                <span className="text-sm font-bold text-white/50 uppercase tracking-widest">
                  {isUploading ? 'Enviando...' : 'Fazer Upload'}
                </span>
                <input type="file" onChange={handleUpload} className="hidden" accept="image/*,video/*" disabled={isUploading} />
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Nome do Modelo/Influenciador (Opcional)</label>
            <input
              type="text"
              value={currentLook.influencerName}
              onChange={e => setEditingLook({ ...currentLook, influencerName: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="Ex: @joao.silva"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Produto Relacionado (Opcional)</label>
            <select
              value={currentLook.productId || ''}
              onChange={e => setEditingLook({ ...currentLook, productId: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors appearance-none"
            >
              <option value="">Nenhum Produto Selecionado</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Ordem de Exibição</label>
            <input
              type="number"
              value={currentLook.ord}
              onChange={e => setEditingLook({ ...currentLook, ord: parseInt(e.target.value) || 0 })}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={() => handleSave(currentLook)}
              disabled={!currentLook.image}
              className="flex-1 bg-[#00ff88] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              Salvar
            </button>
            <button
              onClick={() => { setEditingLook(null); setIsCreating(false); }}
              className="flex-1 bg-white/5 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] rounded-3xl p-10 border border-white/5">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white">Modelagem / Lookbook</h3>
          <p className="text-white/40 text-sm mt-1">Gerencie a galeria de modelos e influenciadores</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-[#00ff88] text-black px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={18} />
          Nova Mídia
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {looks.map(look => (
          <div key={look.id} className="group relative bg-black border border-white/5 rounded-2xl overflow-hidden aspect-[3/4]">
            <MediaRenderer url={look.image} alt="Look" className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity" />
            
            <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingLook(look)}
                  className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white/70 hover:text-[#00ff88] transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(look.id)}
                  className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white/70 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div>
                {look.influencerName && (
                  <p className="text-[#00ff88] font-bold text-sm truncate">{look.influencerName}</p>
                )}
                {look.productId && products.find(p => p._id === look.productId) && (
                  <p className="text-white/70 text-xs truncate">
                    🔗 {products.find(p => p._id === look.productId)?.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {looks.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <Camera size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 font-bold tracking-widest uppercase">Nenhuma foto adicionada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LookbookManager;
