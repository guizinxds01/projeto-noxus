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
  const { products } = useConfig();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openProduct, setOpenProduct] = useState(null);
  const [activeView, setActiveView] = useState(initialView);

  const handleSetView = (v) => {
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
        <Header onAdmin={onAdmin} setView={handleSetView} />
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
        <Header onAdmin={onAdmin} setView={handleSetView} />
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
      <Header onAdmin={onAdmin} setView={handleSetView} />
      <main className="pt-24 pb-20">
        <Banner />
        <CategorySection onSelect={setSelectedCategory} active={selectedCategory} />
        <ProductGrid
          activeCategory={selectedCategory}
          onClearCategory={() => setSelectedCategory(null)}
          onOpenProduct={setOpenProduct}
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
