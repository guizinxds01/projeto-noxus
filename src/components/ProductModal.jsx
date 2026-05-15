import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfig } from '../ConfigContext';

const ProductModal = ({ product, onClose }) => {
  const { config } = useConfig();

  const handleWhatsApp = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id })
    });
    const message = encodeURIComponent(`Olá, tenho interesse neste produto: ${product.name}`);
    window.open(`https://wa.me/${config.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={onClose}></div>
        
        <motion.div
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          className="relative w-full max-w-6xl bg-surface border border-subtle rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 bg-black/10 hover:bg-black/20 p-2 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Left: Gallery */}
          <div className="w-full md:w-1/2 h-[400px] md:h-auto bg-black relative">
             <img 
               src={`${product.images[0]}`} 
               alt={product.name}
               className="w-full h-full object-cover"
             />
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, i) => (
                  <div key={i} className={`h-1 w-8 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`}></div>
                ))}
             </div>
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col overflow-y-auto bg-surface text-main">
            <div className="mb-8">
              <span className="text-[#00ff88] font-black text-sm uppercase tracking-widest mb-4 block">Disponível agora</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{product.name}</h2>
              <p className="text-3xl font-black">R$ {product.price}</p>
            </div>

            <div className="mb-10">
               <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Descrição</h4>
               <p className="text-muted leading-relaxed text-lg">
                 {product.description || "Este produto premium foi desenvolvido com os melhores materiais para garantir durabilidade e estilo único."}
               </p>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-10">
                <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Tamanho</h4>
                <div className="flex gap-3">
                  {product.sizes.map(size => (
                    <button key={size} className="w-12 h-12 rounded-xl border border-subtle flex items-center justify-center font-bold hover:border-[#00ff88] hover:text-[#00ff88] transition-all">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-4">
              <button 
                onClick={handleWhatsApp}
                className="w-full py-6 rounded-2xl bg-main text-[var(--bg-main)] font-black text-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95"
                style={{ backgroundColor: 'var(--text-main)', color: 'var(--bg-main)' }}
              >
                <MessageCircle size={28} />
                Comprar agora
              </button>
              <p className="text-center text-[10px] text-muted font-bold uppercase tracking-widest">Atendimento imediato via WhatsApp</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
