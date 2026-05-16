import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, ShoppingCart, Timer, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../ConfigContext';

import ProductCard from './ProductCard';

const PER_PAGE = 10;

// Componente de Contagem Regressiva para Ofertas
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
      <Timer size={14} className="text-red-500 animate-pulse" />
      <span className="text-[10px] font-black text-white tracking-widest uppercase">
        Oferta termina em: <span className="text-red-500 font-mono">{format(time.h)}:{format(time.m)}:{format(time.s)}</span>
      </span>
    </div>
  );
};

// Componente de Carrossel Horizontal com Setas
const HorizontalCarousel = ({ title, products, onOpenProduct, icon: Icon, iconColor }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 relative group/carousel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-1 ${iconColor || 'bg-primary'} rounded-full`} />
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">{title}</h3>
        </div>
        {title === 'Ofertas Imperdíveis' && <CountdownTimer />}
      </div>

      <div className="relative group">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-all bg-gradient-to-r from-[#050505] to-transparent md:bg-none"
            >
              <ChevronLeft size={32} strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide no-scrollbar snap-x snap-mandatory px-2"
        >
          {products.map(p => (
            <div key={p._id} className="w-[220px] md:w-[280px] flex-shrink-0 snap-start">
              <ProductCard product={p} onSelect={onOpenProduct} />
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white hover:text-primary transition-all bg-gradient-to-l from-[#050505] to-transparent md:bg-none"
            >
              <ChevronRight size={32} strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProductGrid = ({ activeCategory, onClearCategory, onOpenProduct }) => {
  const { categories, products } = useConfig();
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(0);

  // Reset para primeira página quando filtro muda
  useEffect(() => { setPage(0); }, [activeCategory, search]);

  // Filtros especiais
  const featuredProducts = products.filter(p => p.isFeatured && p.status === 'ativo');
  const offerProducts    = products.filter(p => p.onOffer && p.status === 'ativo');
  const bestSellers      = [...products]
    .filter(p => p.status === 'ativo')
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 10);

  const filtered = products.filter(p => {
    if (p.status !== 'ativo') return false;
    
    if (activeCategory) {
      // Se for a categoria direta
      if (p.category === activeCategory) return true;
      
      // Se o produto estiver em uma subcategoria da categoria ativa
      const parentCat = categories.find(c => c.name === activeCategory);
      if (parentCat) {
        const subCats = categories.filter(c => c.parent_id === parentCat._id);
        const subCatNames = subCats.map(c => c.name);
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

      {/* ─── PRATELEIRAS ESPECIAIS (Apenas na Home sem busca) ─── */}
      {!activeCategory && !search && (
        <>
          {/* Peças Mais Vendidas */}
          {bestSellers.length > 0 && (
            <HorizontalCarousel 
              title="Peças Mais Vendidas" 
              products={bestSellers} 
              onOpenProduct={onOpenProduct}
              iconColor="bg-blue-500"
            />
          )}

          {/* Destaques */}
          {featuredProducts.length > 0 && (
            <HorizontalCarousel 
              title="Destaques da Semana" 
              products={featuredProducts} 
              onOpenProduct={onOpenProduct}
              iconColor="bg-yellow-500"
            />
          )}

          {/* Ofertas */}
          {offerProducts.length > 0 && (
            <HorizontalCarousel 
              title="Ofertas Imperdíveis" 
              products={offerProducts} 
              onOpenProduct={onOpenProduct}
              iconColor="bg-red-500"
            />
          )}
        </>
      )}

      {/* ─── FILTRO E GRID PRINCIPAL ─── */}
      <div className="space-y-8 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase text-white tracking-tighter">
              {activeCategory || 'Coleção Completa'}
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
              className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white font-medium outline-none focus:border-[#00ff88]/40 placeholder:text-white/20"
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
              <button onClick={() => { setSearch(''); onClearCategory(); }}
                className="text-[#00ff88] font-bold text-xs uppercase tracking-widest underline">
                Ver todos os produtos
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

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i} onClick={() => setPage(i)}
                    className={`rounded-full transition-all ${i === page ? 'w-8 h-2 bg-[#00ff88]' : 'w-2 h-2 bg-white/10 hover:bg-white/20'}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
