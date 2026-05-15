import React, { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext({});
export const useConfig = () => useContext(Ctx);

const API = '';

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    name: 'NOXUS', logo: '', primaryColor: '#00ff88',
    theme: 'dark', whatsappNumber: '5511920437676'
  });
  const [categories, setCategories] = useState([]);
  const [lookbook, setLookbook] = useState([]);
  const [products, setProducts] = useState([]);

  const reloadProducts = () => {
    fetch(`${API}/api/products`).then(r => r.json()).then(setProducts).catch(() => {});
  };

  useEffect(() => {
    fetch(`${API}/api/config`).then(r => r.json()).then(setConfig).catch(() => {});
    fetch(`${API}/api/categories`).then(r => r.json()).then(setCategories).catch(() => {});
    fetch(`${API}/api/lookbook`).then(r => r.json()).then(setLookbook).catch(() => {});
    reloadProducts();
  }, []);

  useEffect(() => {
    if (config.name) {
      document.title = `${config.name} — Loja Premium`;
    }
    
    // Aplicar Tema e Cores Dinâmicas
    const root = document.documentElement;
    const isDark = config.theme !== 'light';
    
    // Injetar variáveis CSS no root
    root.style.setProperty('--primary', config.primaryColor || '#00ff88');
    
    if (isDark) {
      root.classList.add('dark');
      root.style.setProperty('--bg-main', '#050505');
      root.style.setProperty('--bg-surface', '#0c0c0c');
      root.style.setProperty('--text-main', '#ffffff');
      root.style.setProperty('--text-muted', 'rgba(255,255,255,0.4)');
      root.style.setProperty('--border-subtle', 'rgba(255,255,255,0.05)');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-main', '#f8f9fa');
      root.style.setProperty('--bg-surface', '#ffffff');
      root.style.setProperty('--text-main', '#111111');
      root.style.setProperty('--text-muted', 'rgba(0,0,0,0.5)');
      root.style.setProperty('--border-subtle', 'rgba(0,0,0,0.08)');
    }

    if (config.logo) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = `${API}${config.logo}`;
    }
  }, [config.name, config.logo, config.theme, config.primaryColor]);

  const updateConfig = async (data) => {
    const res = await fetch(`${API}/api/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setConfig(await res.json());
  };

  const reloadCategories = () => {
    fetch(`${API}/api/categories`).then(r => r.json()).then(setCategories).catch(() => {});
  };

  const reloadLookbook = () => {
    fetch(`${API}/api/lookbook`).then(r => r.json()).then(setLookbook).catch(() => {});
  };

  return (
    <Ctx.Provider value={{ config, categories, lookbook, products, updateConfig, reloadCategories, reloadLookbook, reloadProducts }}>
      {children}
    </Ctx.Provider>
  );
};
