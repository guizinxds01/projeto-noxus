import React, { useState } from 'react';
import { useConfig } from '../ConfigContext';
import { motion } from 'framer-motion';

const CategorySection = ({ active, onSelect }) => {
  const { categories } = useConfig();

  if (categories.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-6 mb-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Categorias</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="flex overflow-x-auto pb-2 gap-6 md:gap-10 justify-start md:justify-center scrollbar-hide">
        {/* Todos */}
        <motion.div whileHover={{ scale: 1.05 }} onClick={() => onSelect(null)}
          className="flex flex-col items-center gap-3 cursor-pointer flex-shrink-0 group">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 transition-all flex items-center justify-center bg-[#0c0c0c] overflow-hidden ${!active ? 'border-[#00ff88]' : 'border-white/10 group-hover:border-white/30'}`}>
            <span className="text-[10px] font-black uppercase text-white">Todos</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${!active ? 'text-[#00ff88]' : 'text-white/40'}`}>Ver Tudo</span>
        </motion.div>

        {categories.map(cat => (
          <motion.div key={cat._id} whileHover={{ scale: 1.05 }} onClick={() => { onSelect(cat.name); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="flex flex-col items-center gap-3 cursor-pointer flex-shrink-0 group">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 transition-all flex items-center justify-center bg-[#0c0c0c] overflow-hidden ${active === cat.name ? 'border-[#00ff88]' : 'border-white/10 group-hover:border-white/30'}`}>
              {cat.image ? (
                <img src={`${cat.image}`} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-black italic text-white">{cat.name[0]}</span>
              )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${active === cat.name ? 'text-[#00ff88]' : 'text-white/40 group-hover:text-white'}`}>{cat.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
