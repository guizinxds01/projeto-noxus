import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useConfig } from '../ConfigContext';

const Hero = () => {
  const { config } = useConfig();
  const [banners, setBanners] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => setBanners(data.filter(b => b.status)));
  }, []);

  if (banners.length === 0) return null;
  const current = banners[currentIdx];

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden pt-20">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00ff88]/5 blur-[120px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#00ff88] uppercase tracking-[0.2em] mb-6">
            Coleção Exclusiva 2026
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter uppercase italic">
            {current.title.split(' ').map((word, i) => (
              <span key={i} className={i === 2 ? 'text-[#00ff88]' : ''}>{word} </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg font-medium leading-relaxed">
            {current.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${config.whatsappNumber}`}
              target="_blank"
              className="flex items-center gap-3 bg-[#00ff88] text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-[0_10px_30px_rgba(0,255,136,0.3)]"
            >
              <MessageCircle size={20} />
              {current.buttonText}
            </motion.a>
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(64 + i)}
                 </div>
               ))}
               <div className="pl-6 text-[10px] font-bold text-white/50 uppercase tracking-widest">+500 Clientes Felizes</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          className="relative"
        >
          <div className="relative z-10">
            <img 
              src={current.image ? `${current.image}` : "https://res.cloudinary.com/djv4vnuvo/image/upload/v1715730000/noxus/jersey-placeholder.png"} 
              alt="Destaque" 
              className="w-full max-w-[600px] mx-auto drop-shadow-[0_35px_35px_rgba(0,255,136,0.2)]"
            />
          </div>
          {/* Neon Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-[#00ff88]/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-[#00ff88]/5 rounded-full"></div>
        </motion.div>
      </div>

      {/* Floating Badges */}
      <div className="absolute bottom-10 w-full flex justify-center gap-10 md:gap-20 text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap">
        <span>✓ Qualidade Premium</span>
        <span>✓ Envio para todo Brasil</span>
        <span>✓ Pagamento Seguro</span>
        <span>✓ Suporte 24h</span>
      </div>
    </section>
  );
};

export default Hero;
