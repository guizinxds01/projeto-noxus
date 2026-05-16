import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../ConfigContext';
import ProductCard from './ProductCard';

const PER_PAGE = 10;

// Componente de Contagem Regressiva
const CountdownTimer = () => {
  const [time, setTime] = useState({ h: 2, m: 45, s: 12 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { s = 59; m--; }
        else if (h > 0) { s = 59; m = 59; h--; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const format = (n) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
      <span className="text-[10px] font-black text-white tracking-widest uppercase">
        Oferta termina em: <span className="text-red-500 font-mono">{format(time.h)}:{format(time.m)}:{format(time.s)}</span>
      </span>
    </div>
  );
};

const HorizontalCarousel = ({ title, items, onSelect, icon: Icon, extra }) => {
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
  }, [items]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6 relative group/carousel">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className="text-primary" />}
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">{title}</h3>
        </div>
        {extra}
      </div>

      <div className="relative">
        <AnimatePresence>
          {showLeft && (
            <motion.button
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('left')}
              className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-all bg-gradient-to-r from-[#050505] to-transparent md:bg-none"
            >
              <ChevronLeft size={40} strokeWidth={1} />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide no-scrollbar snap-x snap-mandatory"
        >
          {items.map(p => (
            <div key={p._id} className="w-48 md:w-64 flex-shrink-0 snap-start">
              <ProductCard product={p} onSelect={onSelect} />
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showRight && (
            <motion.button
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('right')}
              className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-all bg-gradient-to-l from-[#050505] to-transparent md:bg-none"
            >
              <ChevronRight size={40} strokeWidth={1} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProductGrid = ({ activeCategory, onClearCategory, onOpenProduct }) => {
  const { products, categories } = useConfig();
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(0);

  useEffect(() => { setPage(0); }, [activeCategory, search]);

  const featuredProducts = products.filter(p => p.isFeatured && p.status === 'ativo');
  const offerProducts    = products.filter(p => p.onOffer && p.status === 'ativo');
  const bestSellers      = [...products]
    .filter(p => p.status === 'ativo')
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 10);

  const filtered = products.filter(p => {
    if (p.status !== 'ativo') return false;
    if (activeCategory) {
      if (p.category === activeCategory) return true;
      const parentCat = categories.find(c => c.name === activeCategory);
      if (parentCat) {
        const subCatNames = categories.filter(c => c.parent_id === parentCat._id).map(c => c.name);
        if (subCatNames.includes(p.category)) return true;
      }
      return false;
    }
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages  = Math.ceil(filtered.length / PER_PAGE);
  const pageItems   = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const hasMultiple = filtered.length > PER_PAGE;

  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

  return (
    <section id="catalog" className="container mx-auto px-4 md:px-6 pb-20 space-y-16">
      {!activeCategory && !search && (
        <>
          <HorizontalCarousel title="Destaques da Semana" items={featuredProducts} onSelect={onOpenProduct} />
          <HorizontalCarousel title="Ofertas Imperdíveis" items={offerProducts} onSelect={onOpenProduct} extra={<CountdownTimer />} />
          <HorizontalCarousel title="Peças Mais Vendidas" items={bestSellers} onSelect={onOpenProduct} />
        </>
      )}

      <div className="space-y-8 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase text-white tracking-tighter">
              {activeCategory || 'Catálogo'}
            </h2>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">
              {filtered.length} {filtered.length === 1 ? 'item' : 'itens'}
              {totalPages > 1 && ` · Página ${page + 1} de ${totalPages}`}
            </p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text" placeholder="Buscar no catálogo..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white font-medium outline-none focus:border-[#00ff88]/40 placeholder:text-white/20 shadow-2xl"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-32 flex flex-col items-center gap-4 text-center">
            <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Nada por aqui no momento.</p>
            {(search || activeCategory) && (
              <button onClick={() => { setSearch(''); onClearCategory(); }} className="text-[#00ff88] font-bold text-xs uppercase tracking-widest underline">
                Ver tudo
              </button>
            )}
          </div>
        ) : (
          <div className="relative group/main">
            <AnimatePresence>
              {hasMultiple && page > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={prev}
                  className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-all bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-2xl"
                >
                  <ChevronLeft size={32} />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={page + (activeCategory || '') + search}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {pageItems.map(product => (
                  <ProductCard key={product._id} product={product} onSelect={onOpenProduct} />
                ))}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {hasMultiple && page < totalPages - 1 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={next}
                  className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-all bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-2xl"
                >
                  <ChevronRight size={32} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
