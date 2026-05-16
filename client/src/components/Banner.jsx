import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('banners').select('*').eq('status', true).order('ord');
      setBanners(data || []);
    };
    load();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setCurrent(idx);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length);
    }, 5000);
  };

  const prev = () => goTo((current - 1 + banners.length) % banners.length);
  const next = () => goTo((current + 1) % banners.length);

  if (banners.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-6 mb-10">
      <div className="relative w-full aspect-[16/7] rounded-2xl md:rounded-3xl overflow-hidden bg-[#0c0c0c] border border-white/5 group">
        {banners.map((ban, i) => (
          <div
            key={ban.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {ban.image ? (
              <img
                src={ban.image}
                alt={ban.title || `Banner ${i + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] flex items-center justify-center text-white/10 font-black uppercase tracking-widest text-sm">
                Sem imagem
              </div>
            )}

            {(ban.title || ban.subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-8 md:px-16">
                {ban.title && (
                  <h2 className="text-2xl md:text-6xl font-black italic uppercase text-white tracking-tighter leading-[0.9] mb-3 max-w-2xl drop-shadow-xl">
                    {ban.title}
                  </h2>
                )}
                {ban.subtitle && (
                  <p className="text-sm md:text-lg text-white/70 font-bold uppercase tracking-wider max-w-md mb-6 drop-shadow">
                    {ban.subtitle}
                  </p>
                )}
                {ban.buttonText && (
                  <a
                    href={ban.buttonLink || '#catalog'}
                    className="w-fit bg-[#00ff88] text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                  >
                    {ban.buttonText}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}

        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all rounded-full ${
                  i === current
                    ? 'w-6 h-2 bg-[#00ff88]'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {banners.length > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10 z-10">
            <div
              key={current}
              className="h-full bg-[#00ff88]"
              style={{ 
                width: '100%',
                animation: 'progress 5s linear'
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner;
