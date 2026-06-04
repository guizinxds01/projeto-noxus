import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import MediaRenderer from './MediaRenderer';
import { slugify } from '../lib/utils';

const ProductCard = ({ product, onSelect }) => {
  // Gerar visualizações (priorizando o valor manual do admin)
  const views = Number(product.viewsCount) > 0 
    ? product.viewsCount 
    : (Math.abs(String(product._id || product.id).split('').reduce((a,b) => {a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)) % 35) + 12;

  return (
    <motion.a
      href={`/produto/${slugify(product.name)}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={(e) => {
        // Se clicar com teclas de modificação para abrir em nova aba/janela, deixa o navegador agir nativamente
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        onSelect && onSelect(product);
      }}
      className="group cursor-pointer flex flex-col bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full block"
    >
      <div className="relative overflow-hidden bg-background/50" style={{ aspectRatio: '1122 / 1402' }}>
        {product.images?.[0] ? (
          <MediaRenderer
            url={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-bold uppercase tracking-widest italic">Sem mídia</div>
        )}

        {/* Badges de Status */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.onOffer && (
            <div className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg shadow-red-500/20">
              Oferta
            </div>
          )}
          {product.isFeatured && (
            <div className="bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg shadow-yellow-500/20">
              Destaque
            </div>
          )}
        </div>

        {/* Badge de Popularidade */}
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-2 py-1 rounded-lg border border-white/5 flex items-center gap-1.5">
            <Flame size={10} className="text-orange-500 fill-orange-500" />
            <span className="uppercase tracking-tighter">{views} viram isso</span>
          </div>
        </div>

        {/* Overlay Interativo */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-bold text-[10px] uppercase tracking-widest bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            Ver Detalhes
          </span>
        </div>
      </div>

      {/* Informações */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="space-y-1">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
            {product.category}
          </p>
          <h3 className="font-bold text-text-main text-sm md:text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors tracking-tight uppercase italic">
            {product.name}
          </h3>
        </div>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="text-primary font-black text-lg md:text-xl tracking-tighter">
            R$ {parseFloat(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          {product.sizes?.length > 0 && (
            <span className="text-[9px] font-bold text-text-muted border border-white/5 px-1.5 py-0.5 rounded uppercase">
              {product.sizes.length} tam
            </span>
          )}
        </div>
      </div>
    </motion.a>
  );
};

export default ProductCard;
