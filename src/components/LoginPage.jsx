import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ArrowLeft, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LoginPage = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: sbError } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (sbError || !data) {
        setError('Usuário ou senha incorretos');
      } else {
        localStorage.setItem('noxus_token', 'session-' + Date.now());
        onLogin();
      }
    } catch (err) {
      setError('Erro ao conectar com o banco de dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff88] rounded-full blur-[200px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0c0c0c] border border-white/5 rounded-[40px] p-10 md:p-12 shadow-2xl relative z-10"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-10"
        >
          <ArrowLeft size={14} /> Voltar para a Loja
        </button>

        <div className="space-y-2 mb-10">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Acesso Restrito</h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Painel Administrativo NOXUS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider"
            >
              <ShieldAlert size={16} />
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Usuário</label>
            <div className="relative">
              <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#00ff88]/50 text-white font-bold transition-all"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#00ff88]/50 text-white font-bold transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#00ff88] text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#00ff88]/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-white/10 font-bold uppercase tracking-[0.3em]">Noxus Admin Security &bull; 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
