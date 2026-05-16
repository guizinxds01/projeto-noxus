import React, { useState } from 'react';
import { useConfig } from '../ConfigContext';
import { Upload, Palette, Image as ImageIcon, Sun, Moon } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AppearanceEditor = () => {
  const { config, updateConfig } = useConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `branding-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      const updated = { ...localConfig, [field]: publicUrl };
      setLocalConfig(updated);
      updateConfig(updated);
    } catch (e) { alert('Erro: ' + e.message); }
    setUploading(false);
  };

  const handleUpdate = (field, value) => {
    const updated = { ...localConfig, [field]: value };
    setLocalConfig(updated);
    updateConfig(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-10">
        <div className="bg-black/40 backdrop-blur-md p-10 rounded-[40px] border border-white/5">
          <div className="flex items-center gap-3 mb-8">
             <Sun className="text-[#00ff88]" />
             <h3 className="text-xl font-black uppercase tracking-tighter text-white">Tema da Loja</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={() => handleUpdate('theme', 'dark')}
               className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all ${localConfig.theme === 'dark' ? 'border-[#00ff88] bg-[#00ff88]/5' : 'border-white/5 hover:border-white/10'}`}
             >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white border border-white/10"><Moon size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest text-white">Escuro</span>
             </button>
             <button 
               onClick={() => handleUpdate('theme', 'light')}
               className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all ${localConfig.theme === 'light' ? 'border-[#00ff88] bg-[#00ff88]/5' : 'border-white/5 hover:border-white/10'}`}
             >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><Sun size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest text-white">Claro</span>
             </button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-10 rounded-[40px] border border-white/5">
          <div className="flex items-center gap-3 mb-8">
             <ImageIcon className="text-[#00ff88]" />
             <h3 className="text-xl font-black uppercase tracking-tighter text-white">Logo</h3>
          </div>
          <div className="flex items-center gap-8">
             <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-10 hover:border-[#00ff88] cursor-pointer transition-all bg-white/[0.02]">
                <Upload className="text-gray-500 mb-2" />
                <span className="text-xs font-bold text-gray-400">{uploading ? 'Enviando...' : 'Trocar Logo'}</span>
                <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'logo')} />
             </label>
             {localConfig.logo && (
               <div className="w-32 h-32 bg-black rounded-3xl flex items-center justify-center p-4 border border-white/10">
                  <img src={localConfig.logo} className="max-h-full max-w-full object-contain" />
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-md p-10 rounded-[40px] border border-white/5 h-fit">
        <div className="flex items-center gap-3 mb-8">
           <Palette className="text-[#00ff88]" />
           <h3 className="text-xl font-black uppercase tracking-tighter text-white">Cores Personalizadas</h3>
        </div>
        <div className="space-y-6">
           <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-2xl border border-white/5">
              <div>
                 <p className="font-black uppercase tracking-tighter text-sm text-white">Cor de Destaque</p>
                 <p className="text-xs text-white/40">Links e botões</p>
              </div>
              <input 
                type="color" 
                value={localConfig.primaryColor} 
                onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceEditor;
