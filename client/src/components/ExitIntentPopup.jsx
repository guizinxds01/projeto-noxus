import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Zap, ArrowRight } from 'lucide-react';
import { useCart } from '../CartContext';

const ExitIntentPopup = () => {
  const { items } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Verificar se já foi mostrado nesta sessão
    const shown = sessionStorage.getItem('noxus_exit_popup');
    if (shown) setHasShown(true);

    const handleMouseLeave = (e) => {
      if (hasShown || items.length > 0) return;

      // Detectar quando o mouse sai pelo topo da tela
      if (e.clientY <= 0) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('noxus_exit_popup', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown, items]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Popup Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0c0c0c] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden"
          >
            {/* Background Decorativo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00ff88] rounded-full blur-[100px] opacity-20" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#00ff88] rounded-full blur-[100px] opacity-10" />

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors p-2"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 text-[#00ff88] px-4 py-2 rounded-full border border-[#00ff88]/20 mb-4">
                <Zap size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Não vá embora ainda!</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                ESPERA! SEU ESTILO <br /> 
                <span className="text-[#00ff88]">MERECE MAIS.</span>
              </h2>

              <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto">
                Não saia sem garantir o seu kit! Nossas peças são limitadas e exclusivas. Aproveite para elevar seu estilo com a NOXUS agora mesmo.
              </p>

              <div className="flex flex-col gap-3 pt-6">
                <button 
                  onClick={() => setIsVisible(false)}
                  className="w-full bg-[#00ff88] text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#00ff88]/20"
                >
                  <ShoppingBag size={18} /> Continuar no Site
                </button>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="w-full py-4 rounded-2xl font-black text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Não, obrigado. Prefiro perder essa.
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
