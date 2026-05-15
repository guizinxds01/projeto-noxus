import React, { useState, useEffect } from 'react';
import { ConfigProvider } from './ConfigContext';
import { CartProvider } from './CartContext';
import AdminPanel from './components/AdminPanel';
import Storefront from './components/Storefront';
import LoginPage from './components/LoginPage';

function App() {
  // Detectar rota inicial
  const getInitialView = () => {
    const path = window.location.pathname;
    if (path === '/admin') return 'admin';
    return 'store';
  };

  const getInitialSubView = () => {
    const path = window.location.pathname;
    if (path === '/ajuda' || path === '/como-comprar') return 'help';
    if (path === '/modelagem') return 'lookbook';
    return 'home';
  };

  const [view, setView] = useState(getInitialView());
  const [subView, setSubView] = useState(getInitialSubView());
  const [storeKey, setStoreKey] = useState(0);
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('noxus_token'));

  // Sincronizar navegação do navegador (botão voltar)
  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
      setSubView(getInitialSubView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goAdmin = () => {
    setView('admin');
    window.history.pushState({}, '', '/admin');
  };

  const goStore = () => {
    setStoreKey(k => k + 1);
    setView('store');
    setSubView('home');
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('noxus_token');
    setIsLogged(false);
    goStore();
  };

  return (
    <ConfigProvider>
      <CartProvider>
        {view === 'store' ? (
          <Storefront 
            key={storeKey} 
            onAdmin={goAdmin} 
            initialView={subView} 
          />
        ) : (
          isLogged ? (
            <AdminPanel onExit={goStore} onLogout={handleLogout} />
          ) : (
            <LoginPage onLogin={() => setIsLogged(true)} onBack={goStore} />
          )
        )}
      </CartProvider>
    </ConfigProvider>
  );
}

export default App;
