import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useConfig } from '../ConfigContext';

const Footer = () => {
  const { config } = useConfig();

  return (
    <footer className="bg-background border-t border-white/5 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
             <motion.div 
               animate={{ 
                 scale: [1, 1.05, 1],
                 filter: [
                   'drop-shadow(0 0 0px transparent)',
                   `drop-shadow(0 0 10px ${config.primaryColor || '#00ff88'})`,
                   'drop-shadow(0 0 0px transparent)'
                 ]
               }}
               transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
               className="mb-6"
             >
                <img src={config.logo} alt={config.name} className="h-8 md:h-10 w-auto object-contain" />
             </motion.div>
             <p className="text-gray-500 text-sm leading-relaxed mb-6">
                A NOXUS é referência em moda premium e exclusiva. Nossa missão é elevar seu estilo com peças únicas e de altíssima qualidade.
             </p>
             <div className="space-y-2 mb-6">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Contato & Endereço</p>
                <p className="text-gray-400 text-xs">nnoxusstore@gmail.com</p>
                <p className="text-gray-400 text-xs">Rua Santa flávia domítilia</p>
             </div>
             <div className="flex gap-4">
                {[MessageCircle, ShoppingBag].map((Icon, i) => (
                  <a key={i} href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <Icon size={20} />
                  </a>
                ))}
             </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6 italic uppercase tracking-tighter">Coleções</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Verão 2026</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coleções Premium</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Acessórios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Edição Limitada</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 italic uppercase tracking-tighter">Suporte</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Dúvidas Frequentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Envios e Prazos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rastreamento</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
             © 2026 {config.name}. Todos os direitos reservados.
           </p>
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Pague com</span>
                <div className="flex gap-4 items-center">
                  <img src="https://logospng.org/download/pix/logo-pix-icone-512.png" alt="Pix" className="h-5 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                  <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-5 opacity-30 grayscale hover:grayscale-0 transition-all" />
                  <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-5 opacity-30 grayscale hover:grayscale-0 transition-all" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
