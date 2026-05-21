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
      setActiveView('home');
      setSelectedCategory(v);
      setTimeout(() => {
        const el = document.getElementById('catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleNextProduct = () => {
    if (!openProduct || products.length === 0) return;
    const currentIdx = products.findIndex(p => p._id === openProduct._id);
    const nextIdx = (currentIdx + 1) % products.length;
    setOpenProduct(products[nextIdx]);
  };

  const handlePrevProduct = () => {
    if (!openProduct || products.length === 0) return;
    const currentIdx = products.findIndex(p => p._id === openProduct._id);
    const prevIdx = (currentIdx - 1 + products.length) % products.length;
    setOpenProduct(products[prevIdx]);
  };

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
