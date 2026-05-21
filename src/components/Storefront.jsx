import React, { useState } from 'react';
import Header from './Header';
import Banner from './Banner';
import CategorySection from './CategorySection';
import ProductGrid from './ProductGrid';
import Footer from './Footer';
import ProductPage from './ProductPage';
import CartDrawer from './CartDrawer';
import InfoSections from './InfoSections';
import LookbookView from './LookbookView';
import HowToBuy from './HowToBuy';
import FloatingWhatsApp from './FloatingWhatsApp';
import ExitIntentPopup from './ExitIntentPopup';
import { ArrowLeft } from 'lucide-react';
import { useConfig } from '../ConfigContext';

const Storefront = ({ onAdmin, initialView = 'home' }) => {
  const { products, loading } = useConfig();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openProduct, setOpenProduct] = useState(null);
  const [activeView, setActiveView] = useState(initialView);
  const [search, setSearch] = useState('');

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center gap-4">
        {/* Spinner Giratório Premium */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-primary/50 animate-spin"></div>
        </div>
        
        {/* Texto da Marca com Efeito Glow */}
        <div className="text-center mt-2 animate-pulse">
          <h2 className="text-xl font-black uppercase italic tracking-[0.25em] text-white">
            NOXUS
          </h2>
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary mt-1 block">
            Carregando Coleções...
          </span>
        </div>
      </div>
    );
  }

  const handleSearchChange = (val) => {
    setSearch(val);
    if (val) {
      if (activeView !== 'home') {
        setActiveView('home');
      }
      setSelectedCategory(null); // Limpa o filtro de categoria ao pesquisar
      setTimeout(() => {
        const el = document.getElementById('catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSetView = (v) => {
    setSearch(''); // Limpa a busca ao navegar por categorias
    if (v === 'home') {
      setActiveView('home');
      setSelectedCategory(null);
    } else if (v === 'help') {
      setActiveView('help');
    } else if (v === 'lookbook') {
      setActiveView('lookbook');
    } else {
      // É uma categoria
      setActiveView('home');
      setSelectedCategory(v);
      // Scroll suave para o catálogo
      setTimeout(() => {
        const el = document.getElementById('catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Componente de Cabeçalho da Página Interna
  const PageHeader = ({ title }) => (
    <div className="bg-[#050505] border-b border-white/5 pt-32 pb-10 px-4 md:px-10">
      <div className="container mx-auto">
        <button 
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest mb-4"
        >
          <ArrowLeft size={14} /> Voltar para o Início
        </button>
        <h1 className="text-5xl md:text-7xl font-display uppercase text-white leading-none">{title}</h1>
      </div>
    </div>
  );

  // Navegação entre produtos
  const handleNextProduct = () => {
    if (!openProduct) return;
    const currentIndex = products.findIndex(p => p._id === openProduct._id);
    if (currentIndex < products.length - 1) {
      setOpenProduct(products[currentIndex + 1]);
    } else {
      setOpenProduct(products[0]); // Loop para o primeiro
    }
  };

  const handlePrevProduct = () => {
    if (!openProduct) return;
    const currentIndex = products.findIndex(p => p._id === openProduct._id);
    if (currentIndex > 0) {
      setOpenProduct(products[currentIndex - 1]);
    } else {
      setOpenProduct(products[products.length - 1]); // Loop para o último
    }
  };

  // Renderização Condicional de Vistas
  if (openProduct) {
    return (
      <>
        <ProductPage 
          product={openProduct} 
          onBack={() => setOpenProduct(null)} 
          onNext={handleNextProduct}
          onPrev={handlePrevProduct}
        />
        <CartDrawer />
        <FloatingWhatsApp />
        <ExitIntentPopup />
      </>
    );
  }

  if (activeView === 'help') {
    return (
      <div className="bg-background min-h-screen">
        <Header onAdmin={onAdmin} setView={handleSetView} search={search} setSearch={handleSearchChange} />
        <div className="pt-10">
          <HowToBuy />
        </div>
        <Footer />
        <CartDrawer />
        <FloatingWhatsApp />
        <ExitIntentPopup />
      </div>
    );
  }

  if (activeView === 'lookbook') {
    return (
      <div className="bg-background min-h-screen">
        <Header onAdmin={onAdmin} setView={handleSetView} search={search} setSearch={handleSearchChange} />
        <LookbookView setOpenProduct={setOpenProduct} />
        <Footer />
        <CartDrawer />
        <FloatingWhatsApp />
        <ExitIntentPopup />
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen">
      <Header onAdmin={onAdmin} setView={handleSetView} search={search} setSearch={handleSearchChange} />
      <main className="pt-24 pb-20">
        <Banner />
        <CategorySection onSelect={setSelectedCategory} active={selectedCategory} />
        <ProductGrid
          activeCategory={selectedCategory}
          onClearCategory={() => setSelectedCategory(null)}
          onOpenProduct={setOpenProduct}
          search={search}
          setSearch={handleSearchChange}
        />
        {/* Na home mostramos as seções resumidas */}
        <InfoSections />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <ExitIntentPopup />
    </div>
  );
};

export default Storefront;
