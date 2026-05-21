import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useConfig } from '../ConfigContext';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const CartDrawer = () => {
  const { items, remove, updateQty, clear, total, count, open, setOpen } = useCart();
  const { config } = useConfig();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Lógica de cálculo de desconto reativo
  const isCouponValid = appliedCoupon && config.couponCode && appliedCoupon === config.couponCode.trim().toUpperCase();
  const couponDiscountPercent = isCouponValid ? (parseFloat(config.couponDiscount) || 0) : 0;
  const discountAmount = (total * couponDiscountPercent) / 100;
  const finalTotal = Math.max(0, total - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const cleanInput = couponInput.trim().toUpperCase();
    if (!cleanInput) return;

    if (config.couponCode && cleanInput === config.couponCode.trim().toUpperCase()) {
      setAppliedCoupon(cleanInput);
    } else {
      setCouponError('Cupom inválido ou expirado');
      setAppliedCoupon('');
    }
  };

  const handleFinalize = () => {
    if (items.length === 0) return;

    const lines = items.map(i =>
      `• *${i.product.name}*${i.size ? ` (Tam: ${i.size})` : ''} x${i.qty} — R$ ${(parseFloat(i.product.price) * i.qty).toFixed(2)}`
    );

    const msgParts = [
      '🛍️ *Novo Pedido NOXUS*',
      '',
      ...lines,
      '',
      `Subtotal: R$ ${total.toFixed(2)}`
    ];

    if (isCouponValid) {
      msgParts.push(`🎟️ Cupom Aplicado: *${appliedCoupon}* (-${couponDiscountPercent}%)`);
      msgParts.push(`Desconto: -R$ ${discountAmount.toFixed(2)}`);
    }

    msgParts.push(`*Total: R$ ${finalTotal.toFixed(2)}*`);
    msgParts.push('');
    msgParts.push('Quero finalizar meu pedido!');

    const msg = msgParts.join('\n');

    window.open(`https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodeURIComponent(msg)}`, '_blank');
    clear();
    setAppliedCoupon('');
    setCouponInput('');
    setOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/5 z-[160] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#00ff88]" />
                <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">
                  Carrinho
                </h2>
                {count > 0 && (
                  <span className="bg-[#00ff88] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-white/10" />
                  <p className="text-white/30 font-black uppercase tracking-widest text-sm">Carrinho vazio</p>
                  <button onClick={() => setOpen(false)}
                    className="text-[#00ff88] font-bold text-xs uppercase tracking-widest underline">
                    Continuar comprando
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl"
                  >
                    {/* Foto */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/5">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm uppercase italic tracking-tight text-white truncate">{item.product.name}</p>
                      {item.size && (
                        <span className="inline-block mt-1 text-[9px] font-black text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                          Tam: {item.size}
                        </span>
                      )}
                      <p className="text-[#00ff88] font-black text-sm mt-1">
                        R$ {(parseFloat(item.product.price) * item.qty).toFixed(2)}
                      </p>

                      {/* Qty controles */}
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => item.qty > 1 ? updateQty(item.key, item.qty - 1) : remove(item.key)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-black text-sm text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => remove(item.key)}
                          className="ml-auto text-red-500/40 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer: Total + Finalizar */}
            {items.length > 0 && (
              <div className="border-t border-white/5 px-6 py-6 space-y-4 bg-[#0a0a0a]">
                {/* Seção de Cupom */}
                <div className="border-b border-white/5 pb-4 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                    <Ticket size={12} className="text-[#00ff88]" />
                    Cupom de Desconto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="INSIRA SEU CUPOM"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      disabled={!!appliedCoupon}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-black tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-[#00ff88] disabled:opacity-50 uppercase"
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={() => {
                          setAppliedCoupon('');
                          setCouponInput('');
                        }}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-black tracking-widest uppercase transition-colors"
                      >
                        Remover
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        className="px-5 py-2 bg-white text-black hover:bg-[#00ff88] rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:shadow-[#00ff88]/10"
                      >
                        Aplicar
                      </button>
                    )}
                  </div>
                  
                  {couponError && (
                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{couponError}</p>
                  )}
                  
                  {isCouponValid && (
                    <p className="text-[#00ff88] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                      ✓ Cupom "{appliedCoupon}" de {couponDiscountPercent}% aplicado!
                    </p>
                  )}
                </div>

                {/* Resumo */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 font-bold uppercase tracking-widest text-xs">{count} {count === 1 ? 'item' : 'itens'}</span>
                    <span className="text-white/40 font-bold text-xs uppercase tracking-widest">Subtotal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-white/60">R$ {total.toFixed(2)}</span>
                    <button onClick={() => { clear(); setAppliedCoupon(''); setCouponInput(''); }} className="text-[10px] font-bold text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors">
                      Limpar tudo
                    </button>
                  </div>

                  {isCouponValid && (
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#00ff88] bg-[#00ff88]/5 border border-[#00ff88]/10 p-3 rounded-xl">
                      <span>Desconto ({appliedCoupon})</span>
                      <span>- R$ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-end border-t border-white/5 pt-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Total</span>
                    <span className="text-3xl font-black text-white">R$ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botão finalizar */}
                <motion.button
                  onClick={handleFinalize}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-[#00ff88] text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 shadow-lg shadow-[#00ff88]/20"
                >
                  <MessageCircle size={20} />
                  Finalizar Pedido via WhatsApp
                  <ArrowRight size={18} />
                </motion.button>

                <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">
                  Você será redirecionado ao WhatsApp com o resumo do pedido
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
