import React from 'react';

const ConnectionError = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-10 text-center font-sans">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">Conexão Pendente</h1>
        <p className="text-gray-400 font-bold mb-10 leading-relaxed">
          O site não conseguiu se conectar ao banco de dados. Isso geralmente acontece quando as chaves da Vercel estão configuradas sem o prefixo <span className="text-[#00ff88]">VITE_</span>.
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4 mb-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">O que fazer agora:</p>
          <ul className="text-xs text-white/70 space-y-2">
            <li>1. Vá ao painel da Vercel</li>
            <li>2. Settings &gt; Environment Variables</li>
            <li>3. Renomeie para <code className="text-[#00ff88]">VITE_SUPABASE_URL</code></li>
            <li>4. Renomeie para <code className="text-[#00ff88]">VITE_SUPABASE_ANON_KEY</code></li>
            <li>5. Salve e faça um novo Deploy</li>
          </ul>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00ff88] transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default ConnectionError;
