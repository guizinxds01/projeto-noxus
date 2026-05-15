import React, { useState } from 'react';
import { useConfig } from '../ConfigContext';
import { useCart } from '../CartContext';
import { 
  ArrowLeft, ShoppingCart, MessageCircle, 
  ChevronLeft, ChevronRight, Shield, Truck, Scissors, 
  RotateCcw, Star, ZoomIn, X, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MediaRenderer from './MediaRenderer';

const API = '';

const ProductPage = ({ product, onBack }) => {
  const { config } = useConfig();
  const { add } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [added, setAdded] = useState(false);
  const [cep, setCep] = useState('');
  const [shippingResult, setShippingResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const images = product.images || [];
  const hasImages = images.length > 0;

  const prevImg = () => setCurrentImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setCurrentImg(i => (i + 1) % images.length);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert('Escolha um tamanho antes de adicionar ao carrinho.');
      return;
    }
    add(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const calculateShipping = () => {
    if (cep.length < 8) {
      alert('Por favor, digite um CEP válido.');
      return;
    }
    setCalculating(true);
    // Simular delay de API
    setTimeout(() => {
      setShippingResult([
        { type: 'PAC', price: '19,90', time: '8-12 dias úteis' },
        { type: 'SEDEX', price: '34,90', time: '2-4 dias úteis' }
      ]);
      setCalculating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 px-4 md:px-10 py-4 flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
          <ArrowLeft size={18} /> Voltar
        </button>
        <span className="text-white/20 text-xs uppercase tracking-widest font-bold">/</span>
        <span className="text-white/40 text-xs uppercase tracking-widest font-bold truncate">{product.category}</span>
        <span className="text-white/20 text-xs uppercase tracking-widest font-bold">/</span>
        <span className="text-white text-xs uppercase tracking-widest font-bold truncate">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">

          {/* ── COLUNA ESQUERDA: Galeria ── */}
          <div className="space-y-4">
            {/* Imagem principal — Proporção 1122x1402 */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#0c0c0c] border border-white/5 group" style={{ aspectRatio: '1122 / 1402' }}>
              {hasImages ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImg}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full cursor-zoom-in"
                      onClick={() => setLightbox(true)}
                    >
                      <MediaRenderer
                        url={images[currentImg]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  {/* Zoom icon */}
                  <button onClick={() => setLightbox(true)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={18} />
                  </button>
                  {/* Setas */}
                  {images.length > 1 && (
                    <>
                      <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                  {/* Contador */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {currentImg + 1} / {images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-xl uppercase tracking-widest">Sem foto</div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)}
                    className={`flex-shrink-0 w-20 rounded-xl overflow-hidden border-2 transition-all ${i === currentImg ? 'border-[#00ff88]' : 'border-white/10 hover:border-white/30'}`}
                    style={{ aspectRatio: '1122 / 1402' }}>
                    <MediaRenderer url={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── COLUNA DIREITA: Informações ── */}
          <div className="flex flex-col space-y-6">
            {/* Categoria + nome */}
            <div>
              <p className="text-[10px] font-bold text-[#00ff88] uppercase tracking-[0.3em] mb-2">{product.category}</p>
              <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-white leading-[0.9] mb-4">{product.name}</h1>
              {/* Estrelas decorativas */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-[#00ff88] fill-[#00ff88]" />
                ))}
                <span className="text-white/30 text-[10px] font-bold ml-2 uppercase tracking-widest">Premium Choice</span>
              </div>
            </div>

            {/* Preço — Estilo Minimalista e Definido */}
            <div className="py-8 border-y border-white/5 space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                  R$ {product.price}
                </span>
                <span className="bg-[#00ff88]/10 text-[#00ff88] text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest border border-[#00ff88]/20">
                  5% OFF no PIX
                </span>
              </div>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                Ou em até 12x de R$ {(parseFloat(product.price)/12).toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Seletor de Tamanho — sempre visível */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Escolha o Tamanho</p>
                {selectedSize && (
                  <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest">
                    ✓ Selecionado: {selectedSize}
                  </span>
                )}
              </div>

              {product.sizes && product.sizes.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(prev => prev === size ? null : size)}
                      whileTap={{ scale: 0.95 }}
                      className={`min-w-[56px] px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all border-2 ${
                        selectedSize === size
                          ? 'bg-[#00ff88] text-black border-[#00ff88] shadow-lg shadow-[#00ff88]/30 scale-105'
                          : 'bg-transparent text-white border-white/15 hover:border-[#00ff88]/60 hover:bg-white/5'
                      }`}>
                      {size}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl">
                  <span className="text-white/30 text-xs font-bold uppercase tracking-widest">
                    Tamanho único — sem necessidade de seleção
                  </span>
                </div>
              )}
            </div>

            {/* Botão Carrinho / WhatsApp */}
            <div className="space-y-3 pt-2">
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  added
                    ? 'bg-[#00ff88]/80 text-black'
                    : 'bg-[#00ff88] text-black hover:opacity-90 shadow-xl shadow-[#00ff88]/20'
                }`}>
                {added ? (
                  <><CheckCircle2 size={22} /> Redirecionando...</>
                ) : (
                  <><ShoppingCart size={22} /> Adicionar ao Carrinho</>
                )}
              </motion.button>

            </div>

            {/* Badges de confiança */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: 'Qualidade Garantida' },
                { icon: Scissors, label: 'Sob Demanda' },
                { icon: RotateCcw, label: 'Troca Fácil' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-4 bg-white/[0.03] rounded-2xl border border-white/5 text-center">
                  <Icon size={20} className="text-[#00ff88]" />
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* Descrição */}
            {product.description && (
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Sobre o Produto</p>
                <p className="text-white/60 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}

            {/* Cálculo de Frete */}
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={16} className="text-[#00ff88]" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Calcular Frete</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Seu CEP (00000-000)"
                  value={cep}
                  onChange={e => setCep(e.target.value.replace(/\D/g, '').substring(0, 8))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00ff88]/50 outline-none font-bold"
                />
                <button 
                  onClick={calculateShipping}
                  disabled={calculating}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {calculating ? 'Calculando...' : 'Calcular'}
                </button>
              </div>

              {/* Resultados do Frete */}
              <AnimatePresence>
                {shippingResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {shippingResult.map((res, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest">{res.type}</span>
                          <span className="text-[9px] text-white/40 font-bold uppercase">{res.time}</span>
                        </div>
                        <span className="text-sm font-black text-white">R$ {res.price}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-4 text-[9px] text-white/20 font-bold uppercase tracking-widest">
                Entrega para todo o Brasil via Correios ou Transportadora
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}>
            <button className="absolute top-6 right-6 text-white/50 hover:text-white"><X size={28} /></button>
            <motion.div
              key={currentImg}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="max-w-full max-h-full rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <MediaRenderer
                url={images[currentImg]}
                alt=""
                className="max-w-full max-h-full object-contain"
                autoPlay
                controls
              />
            </motion.div>
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prevImg(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white"><ChevronLeft size={24} /></button>
                <button onClick={e => { e.stopPropagation(); nextImg(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white"><ChevronRight size={24} /></button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;
