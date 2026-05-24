import React, { createContext, useContext, useState, useCallback } from 'react';

const CartCtx = createContext({});
export const useCart = () => useContext(CartCtx);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);   // { id, product, size, qty }
  const [open, setOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const add = useCallback((product, size) => {
    const key = `${product._id}_${size || ''}`;
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { key, product, size, qty: 1 }];
    });
    setOpen(true); // abre o carrinho automaticamente
  }, []);

  const remove = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((acc, i) => acc + (parseFloat(i.product.price) || 0) * i.qty, 0);
  const count = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, total, count, open, setOpen, appliedCoupon, setAppliedCoupon }}>
      {children}
    </CartCtx.Provider>
  );
};
