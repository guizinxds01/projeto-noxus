import React from 'react';
import { useConfig } from '../ConfigContext';
import { Ticket, Percent, Save, Sparkles } from 'lucide-react';

const CouponManager = () => {
  const { config, updateConfig } = useConfig();

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Painel de Cupons
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1.5 font-bold">
            Gerencie e configure os cupons promocionais ativos em sua loja
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/20 px-4 py-2 rounded-xl self-start">
          <Sparkles size={14} className="text-[#00ff88] animate-pulse" />
          <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-wider">
            Sincronização Ativa
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center border border-[#00ff88]/20">
              <Ticket size={20} className="text-[#00ff88]" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                Cupom Promocional Ativo
              </h3>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-wider mt-0.5">
                Os clientes poderão utilizar este cupom globalmente
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Código */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">
                Código do Cupom
              </label>
              <input
                type="text"
                placeholder="EX: NOXUS10"
                value={config.couponCode || ''}
                onChange={e => updateConfig({ ...config, couponCode: e.target.value.toUpperCase().replace(/\s/g, '') })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-black tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-[#00ff88] uppercase transition-all duration-300"
              />
              <span className="text-[9px] text-white/20 font-bold uppercase tracking-wider block">
                Apenas letras e números (sem espaços)
              </span>
            </div>

            {/* Input Porcentagem */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">
                Desconto (%)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="10"
                  value={config.couponDiscount || ''}
                  onChange={e => {
                    const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                    updateConfig({ ...config, couponDiscount: String(val) });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm font-black tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-[#00ff88] transition-all duration-300"
                />
                <div className="absolute right-4 flex items-center justify-center text-white/30">
                  <Percent size={16} />
                </div>
              </div>
              <span className="text-[9px] text-white/20 font-bold uppercase tracking-wider block">
                Valor numérico entre 0 e 100
              </span>
            </div>
          </div>
        </div>

        {/* Card Lateral de Status */}
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl flex flex-col justify-between min-h-[300px]">
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-3">
              Status do Cupom
            </h4>
            
            {config.couponCode && parseFloat(config.couponDiscount) > 0 ? (
              <div className="space-y-5">
                <div className="bg-[#00ff88]/5 border border-[#00ff88]/10 rounded-2xl p-6 text-center shadow-lg shadow-[#00ff88]/2">
                  <span className="text-[9px] font-black text-[#00ff88]/60 uppercase tracking-widest block mb-2">
                    Código de Cupom Ativo
                  </span>
                  <span className="text-3xl font-black tracking-widest text-white uppercase italic font-display">
                    {config.couponCode}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                  <span className="text-white/40 font-black uppercase tracking-wider">
                    Valor do Desconto
                  </span>
                  <span className="text-[#00ff88] font-black text-sm">
                    {config.couponDiscount}% OFF
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                  <span className="text-white/40 font-black uppercase tracking-wider">
                    Disponibilidade
                  </span>
                  <span className="text-white font-black uppercase tracking-widest text-[10px]">
                    Ilimitado / Ativo
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 text-center">
                <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest block">
                  Nenhum cupom ativo no momento
                </span>
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider mt-2 block">
                  Insira as informações ao lado para ativar
                </span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-relaxed pt-8 border-t border-white/5">
            As alterações salvas são reativas. Seus clientes poderão visualizar e aplicar o cupom imediatamente.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponManager;
