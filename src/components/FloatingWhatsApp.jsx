import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConfig } from '../ConfigContext';

const FloatingWhatsApp = () => {
  const { config } = useConfig();

  return (
    <motion.a
      href={`https://api.whatsapp.com/send?phone=${config.whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 left-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center border-2 border-white/20"
    >
      <MessageCircle size={28} fill="currentColor" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
