import React, { useState } from 'react';
import { useConfig } from '../ConfigContext';
import { Upload, Palette, Image as ImageIcon, Sun, Moon } from 'lucide-react';

const AppearanceEditor = () => {
  const { config, updateConfig } = useConfig();
  const [localConfig, setLocalConfig] = useState(config);

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    const updated = { ...localConfig, [field]: data.url };
    setLocalConfig(updated);
    updateConfig(updated);
  };

  const handleUpdate = (field, value) => {
    const updated = { ...localConfig, [field]: value };
    setLocalConfig(updated);
    updateConfig(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Branding & Theme */}
      <div className="space-y-10">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
             <Sun className="text-[#00ff88]" />
             <h3 className="text-xl font-black uppercase tracking-tighter text-black">Tema da Loja</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={() => handleUpdate('theme', 'dark')}
               className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all ${localConfig.theme === 'dark' ? 'border-[#00ff88] bg-[#00ff88]/5' : 'border-gray-100 hover:border-gray-200'}`}
             >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white"><Moon size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest text-black">Escuro</span>
             </button>
             <button 
               onClick={() => handleUpdate('theme', 'light')}
               className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all ${localConfig.theme === 'light' ? 'border-[#00ff88] bg-[#00ff88]/5' : 'border-gray-100 hover:border-gray-200'}`}
             >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><Sun size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest text-black">Claro</span>
             </button>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
             <ImageIcon className="text-[#00ff88]" />
             <h3 className="text-xl font-black uppercase tracking-tighter text-black">Logo</h3>
          </div>
          <div className="flex items-center gap-8">
             <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-10 hover:border-[#00ff88] cursor-pointer transition-all bg-[#f8f9fa]">
                <Upload className="text-gray-300 mb-2" />
                <span className="text-xs font-bold text-gray-400">Trocar Logo</span>
                <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'logo')} />
             </label>
             {localConfig.logo && (
               <div className="w-32 h-32 bg-black rounded-3xl flex items-center justify-center p-4">
                  <img src={`${localConfig.logo}`} className="max-h-full max-w-full object-contain" />
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 h-fit">
        <div className="flex items-center gap-3 mb-8">
           <Palette className="text-[#00ff88]" />
           <h3 className="text-xl font-black uppercase tracking-tighter text-black">Cores Personalizadas</h3>
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between p-6 bg-[#f8f9fa] rounded-2xl">
              <div>
                 <p className="font-black uppercase tracking-tighter text-sm text-black">Cor de Destaque</p>
                 <p className="text-xs text-gray-400">Links e botões</p>
              </div>
              <input 
                type="color" 
                value={localConfig.primaryColor} 
                onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                className="w-12 h-12 rounded-xl border-none cursor-pointer"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceEditor;
