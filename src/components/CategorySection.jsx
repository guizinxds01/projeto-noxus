import React, { useState } from 'react';
import { useConfig } from '../ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySection = ({ active, onSelect }) => {
  const { categories } = useConfig();

  if (categories.length === 0) return null;

  const scrollRef = React.useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 md:px-6 mb-10 relative group">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Categorias</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="relative">
        <AnimatePresence>
          {showLeft && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-30 text-white hover:text-[#00ff88] transition-all hidden md:flex"
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto pb-2 gap-6 md:gap-10 justify-start md:justify-center scrollbar-hide no-scrollbar"
        >
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

        <AnimatePresence>
          {showRight && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-30 text-white hover:text-[#00ff88] transition-all hidden md:flex"
            >
              <ChevronRight size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CategorySection;
