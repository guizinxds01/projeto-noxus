import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ShoppingCart, MessageCircle } from 'lucide-react';

const HowToBuy = () => {
  const steps = [
    {
      id: 1,
      icon: Search,
      title: 'NAVEGUE PELO SITE',
      desc: 'Explore nossos produtos e encontre o modelo ideal para você.',
      color: '#00ff88'
    },
    {
      id: 2,
      icon: ShoppingBag,
      title: 'ESCOLHA SEU PRODUTO',
      desc: 'Selecione o produto, escolha o tamanho desejado e adicione ao carrinho.',
      color: '#facc15'
    },
    {
      id: 3,
      icon: ShoppingCart,
      title: 'VÁ ATÉ O CARRINHO',
      desc: 'Clique no carrinho para revisar os produtos escolhidos.',
      color: '#00ff88',
      highlight: true
    },
    {
      id: 4,
      icon: MessageCircle,
      title: 'FINALIZE PELO WHATSAPP',
      desc: 'Envie seu pedido diretamente pelo WhatsApp para finalizar sua compra com atendimento rápido.',
      color: '#25D366'
    }
  ];

  return (
    <div className="py-24 px-6 bg-[#050505]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black uppercase text-white leading-tight"
          >
            COMO COMPRAR NA <span className="text-[#00ff88]">NOXUS</span> <br />
            <span className="text-white/20">STORE</span>
          </motion.h2>
          <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto">
            Compre de forma rápida, simples e segura diretamente pelo WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-3xl border border-white/5 bg-[#0c0c0c] flex flex-col items-center text-center group ${step.highlight ? 'ring-2 ring-[#00ff88]/20 bg-gradient-to-b from-[#00ff88]/10 to-transparent' : ''}`}
            >
              {/* Number Background */}
              <span className="absolute top-6 right-8 text-7xl font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors">
                {step.id}
              </span>

              {/* Icon Circle */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-8 relative z-10"
                style={{ backgroundColor: `${step.color}15`, color: step.color }}
              >
                <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ backgroundColor: step.color }} />
                <step.icon size={28} />
              </div>

              <h3 className="text-lg font-black uppercase italic tracking-tighter text-white mb-4 relative z-10">
                {step.title}
              </h3>
              <p className="text-white/40 text-xs leading-relaxed relative z-10">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToBuy;
