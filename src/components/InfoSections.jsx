import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Package, Scissors } from 'lucide-react';

const InfoSections = ({ only }) => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 space-y-32">
      
      {/* Política de Troca & Segurança */}
      {(!only || only === 'help') && (
        <section id="politica" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: RotateCcw, 
              title: 'Política de Troca', 
              desc: 'Trocas em até 7 dias após o recebimento. Sem burocracia e direto pelo WhatsApp.' 
            },
            { 
              icon: ShieldCheck, 
              title: 'Compra Segura', 
              desc: 'Seus dados e pagamentos são processados com as tecnologias mais seguras do mercado.' 
            },
            { 
              icon: Scissors, 
              title: 'Feito sob Demanda', 
              desc: 'Produzimos cada peça exclusivamente para você, garantindo qualidade e redução de desperdício.' 
            },
            { 
              icon: Package, 
              title: 'Embalagem Premium', 
              desc: 'Suas peças chegam em embalagens personalizadas que garantem a integridade.' 
            },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-[#0c0c0c] border border-white/5 rounded-3xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88]">
                <item.icon size={24} />
              </div>
              <h4 className="text-lg font-black uppercase italic tracking-tighter text-white">{item.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </section>
      )}
    </div>
  );
};

export default InfoSections;
