import React, { useState, useEffect } from 'react';
import { useConfig } from '../ConfigContext';
import { useCart } from '../CartContext';
import { Menu, X, MessageCircle, ShoppingBag, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MediaRenderer from './MediaRenderer';

const Header = ({ setView, onAdmin, search, setSearch }) => {
  const { config, categories, products } = useConfig();
  const { count, setOpen: openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Categorias organizadas por Hierarquia
  const parentCategories = categories.filter(c => !c.parent_id);
  const getSubcategories = (parentId) => categories.filter(c => c.parent_id === parentId);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 relative flex items-center justify-between">
        {/* Left: Navigation */}
        <div className="flex items-center gap-4 flex-1">
          <button className="md:hidden text-white" onClick={() => setMenuOpen(true)}><Menu size={24} /></button>
          <nav className="hidden md:flex gap-10 items-center">
            <a href="/" onClick={(e) => { e.preventDefault(); setView('home'); window.history.pushState({}, '', '/'); }} className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Início</a>
            
            {/* Mega Menu Toggle */}
            <div 
              className="relative py-4"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button 
                className={`text-[12px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${megaMenuOpen ? 'text-[#00ff88]' : 'text-white/70 hover:text-white'}`}
              >
                Categorias
                <ChevronRight size={10} className={`transition-transform duration-300 ${megaMenuOpen ? 'rotate-90 text-[#00ff88]' : ''}`} />
              </button>

              {/* Mega Menu Panel */}
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="fixed top-24 left-0 w-full bg-[#050505]/95 backdrop-blur-2xl border-b border-white/5 py-12 shadow-2xl z-[150]"
                  >
                    <div className="container mx-auto px-10">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                        {parentCategories.map(parent => {
                          const subs = getSubcategories(parent._id);
                          const categoryProducts = products.filter(p => p.category === parent.name).slice(0, 3);

                          return (
                            <div key={parent._id} className="space-y-6">
                              <button
                                onClick={() => { setView(parent.name); setMegaMenuOpen(false); }}
                                className="text-sm font-black uppercase tracking-widest text-white hover:text-primary transition-colors border-b border-white/10 pb-2 w-full text-left"
                              >
                                {parent.name}
                              </button>
                              
                              {subs.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                  {subs.map(sub => (
                                    <button
                                      key={sub._id}
                                      onClick={() => { setView(sub.name); setMegaMenuOpen(false); }}
                                      className="text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-text-main text-left transition-colors"
                                    >
                                      {sub.name}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-col gap-4">
                                  {categoryProducts.map(p => (
                                    <button
                                      key={p._id}
                                      onClick={() => { setView(p.name); setMegaMenuOpen(false); }}
                                      className="flex items-center gap-3 group/prod text-left"
                                    >
                                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/5 bg-surface flex-shrink-0">
                                        <MediaRenderer url={p.images[0]} className="w-full h-full object-cover group-hover/prod:scale-110 transition-transform" />
                                      </div>
                                      <span className="text-[10px] font-bold uppercase text-text-muted group-hover/prod:text-primary transition-colors line-clamp-2">
                                        {p.name}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#catalog" className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Catálogo</a>
            <a href="/modelagem" onClick={(e) => { e.preventDefault(); setView('lookbook'); window.history.pushState({}, '', '/modelagem'); }} className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#00ff88]/80 hover:text-[#00ff88] transition-colors">Modelagem</a>
            <a href="/como-comprar" onClick={(e) => { e.preventDefault(); setView('help'); window.history.pushState({}, '', '/como-comprar'); }} className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Como Comprar</a>
          </nav>
        </div>

        {/* Center: Logo — Absolute Dead Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          {config.logo ? (
              <motion.img
                src={config.logo}
                alt={config.name}
                onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              animate={{ 
                y: [0, -8, 0],
                scale: [1, 1.08, 1],
                filter: [
                  'drop-shadow(0 0 10px transparent)',
                  `drop-shadow(0 0 40px ${config.primaryColor || '#00ff88'})`,
                  'drop-shadow(0 0 10px transparent)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="h-14 md:h-20 object-contain cursor-pointer pointer-events-auto"
            />
          ) : (
            <motion.span
              onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              animate={{ 
                y: [0, -8, 0],
                scale: [1, 1.08, 1],
                textShadow: [
                  '0 0 10px transparent',
                  `0 0 40px ${config.primaryColor || '#00ff88'}`,
                  '0 0 10px transparent'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="text-3xl md:text-4xl font-black italic tracking-tighter text-white cursor-pointer select-none pointer-events-auto"
            >
              {config.name || 'NOXUS'}
            </motion.span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 flex-1">
          
          {/* Lupa de Pesquisa Interativa e Elegante */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 150, opacity: 1, marginRight: 4 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Buscar no catálogo..."
                  value={search || ''}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-full py-1.5 px-4 text-[11px] text-white outline-none focus:border-[#00ff88]/40 placeholder:text-white/30 backdrop-blur-md"
                  autoFocus
                />
              )}
            </AnimatePresence>
            
            <button 
              onClick={() => {
                if (searchOpen && search) {
                  setSearch('');
                } else {
                  setSearchOpen(!searchOpen);
                }
              }} 
              className={`p-2 transition-colors ${searchOpen || search ? 'text-[#00ff88]' : 'text-white/70 hover:text-white'}`}
              title="Buscar no catálogo"
            >
              {searchOpen && search ? (
                <X size={20} />
              ) : (
                <Search size={20} />
              )}
            </button>
          </div>

          {/* Ícone do Carrinho */}
          <button onClick={() => openCart(true)} className="relative p-2 text-white/70 hover:text-white transition-colors">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#00ff88] text-black text-[9px] font-black rounded-full flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </button>

          <a href={`https://api.whatsapp.com/send?phone=${config.whatsappNumber}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 bg-[#00ff88] text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-[#00ff88]/20 transition-all hover:scale-105 active:scale-95">
            <MessageCircle size={16} />
            <span className="hidden md:block">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[60]" onClick={() => setMenuOpen(false)} />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 w-72 h-full bg-[#050505] z-[100] p-8 flex flex-col shadow-2xl border-r border-white/5"
            >
              <div className="flex justify-between items-center mb-12">
                <motion.span 
                  className="text-xl font-black italic text-white"
                >
                  {config.name || 'NOXUS'}
                </motion.span>
                <button onClick={() => setMenuOpen(false)} className="p-2 text-white/50 hover:text-white bg-white/5 rounded-lg"><X size={24} /></button>
              </div>
              <nav className="flex flex-col gap-6">
                <a href="#" onClick={() => { setView('home'); setMenuOpen(false); }} className="text-2xl font-black uppercase italic text-white">Início</a>
                
                {/* Categorias no Mobile */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Coleções</p>
                  {parentCategories.map(parent => {
                    const subs = getSubcategories(parent._id);
                    return (
                      <div key={parent._id} className="space-y-2">
                        <button 
                          onClick={() => { setView(parent.name); setMenuOpen(false); }}
                          className="text-xl font-black uppercase text-white hover:text-[#00ff88] transition-colors"
                        >
                          {parent.name}
                        </button>
                        {subs.length > 0 && (
                          <div className="flex flex-col gap-2 pl-4 border-l border-white/5">
                            {subs.map(sub => (
                              <button
                                key={sub._id}
                                onClick={() => { setView(sub.name); setMenuOpen(false); }}
                                className="text-sm font-bold uppercase text-white/40 hover:text-[#00ff88] transition-colors"
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <a href="/modelagem" onClick={(e) => { e.preventDefault(); setView('lookbook'); setMenuOpen(false); }} className="text-2xl font-black uppercase italic text-[#00ff88]">Modelagem</a>
                <a href="/como-comprar" onClick={(e) => { e.preventDefault(); setView('help'); setMenuOpen(false); }} className="text-2xl font-black uppercase italic text-white">Como Comprar</a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
