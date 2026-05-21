import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

const Ctx = createContext({});
export const useConfig = () => useContext(Ctx);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    name: 'NOXUS', logo: '', primaryColor: '#00ff88',
    theme: 'dark', whatsappNumber: '5511920437676'
  });
  const [categories, setCategories] = useState([]);
  const [lookbook, setLookbook] = useState([]);
  const [products, setProducts] = useState([]);

  const parseLook = (l) => {
  if (!l) return null;
  return {
    id: l.id,
    image: l.image,
    influencerName: l.influencername || l.influencerName || '',
    productId: l.productid || l.productId || '',
    ord: l.ord || 0
  };
};

const parseProduct = (p) => {
    if (!p) return null;
    return {
      _id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      category: p.category,
      images: Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]'),
      sizes: Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || '[]'),
      status: p.status,
      clicks: p.clicks || 0,
      isFeatured: !!p.is_featured,
      onOffer: !!p.on_offer,
      viewsCount: p.views_count || 0
    };
  };

  const [loading, setLoading] = useState(true);

  const initApp = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, lookbookRes, configRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('lookbook').select('*').order('ord'),
        supabase.from('config').select('*')
      ]);

      if (productsRes.data) {
        setProducts(productsRes.data.map(parseProduct));
      }
      if (categoriesRes.data) {
        setCategories(categoriesRes.data.map(c => ({ _id: c.id, ...c })));
      }
      if (lookbookRes.data) {
        setLookbook(lookbookRes.data.map(parseLook));
      }
      if (configRes.data) {
        const cfg = {};
        configRes.data.forEach(r => { cfg[r.key] = r.value; });
        if (Object.keys(cfg).length > 0) setConfig(p => ({ ...p, ...cfg }));
      }
    } catch (e) {
      console.error("Erro ao inicializar app:", e);
    } finally {
      setLoading(false);
    }
  };

  const reloadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    setProducts((data || []).map(parseProduct));
  };

  const reloadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories((data || []).map(c => ({ _id: c.id, ...c })));
  };

  const reloadLookbook = async () => {
    const { data } = await supabase.from('lookbook').select('*').order('ord');
    setLookbook((data || []).map(parseLook));
  };

  const loadConfig = async () => {
    const { data } = await supabase.from('config').select('*');
    const cfg = {};
    data?.forEach(r => { cfg[r.key] = r.value; });
    if (Object.keys(cfg).length > 0) setConfig(p => ({ ...p, ...cfg }));
  };

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    if (config.name) {
      document.title = `${config.name} — Loja Premium`;
    }
    
    const root = document.documentElement;
    const isDark = config.theme !== 'light';
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
      link.href = config.logo;
    }
  }, [config.name, config.logo, config.theme, config.primaryColor]);

  const updateConfig = async (data) => {
    const entries = Object.entries(data).map(([key, value]) => ({ key, value: String(value) }));
    await supabase.from('config').upsert(entries);
    loadConfig();
  };

  return (
    <Ctx.Provider value={{ config, categories, lookbook, products, loading, updateConfig, reloadCategories, reloadLookbook, reloadProducts }}>
      {children}
    </Ctx.Provider>
  );
};
