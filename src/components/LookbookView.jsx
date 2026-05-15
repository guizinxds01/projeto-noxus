import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { useConfig } from '../ConfigContext';

import MediaRenderer from './MediaRenderer';

const LookbookView = ({ setOpenProduct }) => {
  const { lookbook, products } = useConfig();

  if (!lookbook || lookbook.length === 0) {
    return (
      <div className="py-32 px-6 text-center bg-[#050505]">
        <h2 className="text-3xl font-display text-white uppercase mb-4">Modelagem</h2>
        <p className="text-white/40">Nenhuma foto adicionada ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display uppercase text-white mb-6 tracking-tighter">Modelagem</h2>
          <p className="text-white/50 text-sm md:text-base">
            Nossa galeria oficial. Inspire-se com as combinações de nossa comunidade e influenciadores vestindo as últimas peças.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {lookbook.map((look, idx) => {
            const product = look.productId ? products.find(p => p.id === look.productId) : null;

            return (
              <motion.div
                key={look.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-black"
              >
                <MediaRenderer
                  url={look.image}
                  alt={look.influencerName || "Modelagem"} 
                  className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  
                  {look.influencerName && (
                    <div className="flex items-center gap-2 mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <User size={16} className="text-[#00ff88]" />
                      <span className="text-white font-bold text-sm">{look.influencerName}</span>
                    </div>
                  )}

                  {product && (
                    <button
                      onClick={() => setOpenProduct(product)}
                      className="flex items-center justify-between bg-white/10 hover:bg-[#00ff88] text-white hover:text-black backdrop-blur-md rounded-xl p-4 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Ver Peça</span>
                        <span className="font-bold text-sm truncate max-w-[180px]">{product.name}</span>
                      </div>
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default LookbookView;
