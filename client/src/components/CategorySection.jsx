import React, { useRef, useState, useEffect } from 'react';
import { useConfig } from '../ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySection = ({ active, onSelect }) => {
  const { categories } = useConfig();
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-6 mb-10 relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Navegar por Categorias</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="relative group/cats">
        <AnimatePresence>
          {showLeft && (
            <motion.button
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white shadow-xl hover:text-primary transition-all"
            >
              <ChevronLeft size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto pb-4 gap-6 md:gap-10 justify-start md:justify-center scrollbar-hide no-scrollbar"
        >
          {/* Todos */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            onClick={() => onSelect(null)}
            className="flex flex-col items-center gap-3 cursor-pointer flex-shrink-0 group"
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 transition-all flex items-center justify-center bg-[#0c0c0c] overflow-hidden ${!active ? 'border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.2)]' : 'border-white/10 group-hover:border-white/30'}`}>
              <span className="text-[10px] font-black uppercase text-white">Todos</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${!active ? 'text-[#00ff88]' : 'text-white/40'}`}>Ver Tudo</span>
          </motion.div>

          {categories.filter(c => !c.parent_id).map(cat => (
            <motion.div 
              key={cat._id} 
              whileHover={{ scale: 1.05 }} 
              onClick={() => { onSelect(cat.name); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex flex-col items-center gap-3 cursor-pointer flex-shrink-0 group"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 transition-all flex items-center justify-center bg-[#0c0c0c] overflow-hidden ${active === cat.name ? 'border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.2)]' : 'border-white/10 group-hover:border-white/30'}`}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black italic text-white">{cat.name[0]}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${active === cat.name ? 'text-[#00ff88]' : 'text-white/40 group-hover:text-white'}`}>{cat.name}</span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showRight && (
            <motion.button
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white shadow-xl hover:text-primary transition-all"
            >
              <ChevronRight size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CategorySection;
