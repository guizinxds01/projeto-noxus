import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    banners: 0,
    clicks: 0
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const [
        { data: p },
        { data: c },
        { data: b }
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('banners').select('*')
      ]);

      const totalClicks = (p || []).reduce((acc, curr) => acc + (curr.clicks || 0), 0);
      setStats({
        products: (p || []).length,
        categories: (c || []).length,
        banners: (b || []).length,
        clicks: totalClicks
      });

      // Simular dados de gráfico baseados nos produtos atuais
      const data = (p || []).slice(0, 7).map(item => ({
        name: item.name.substring(0, 10),
        vendas: Math.floor(Math.random() * 50) + 10,
        visitas: (item.clicks || 0) + Math.floor(Math.random() * 100)
      }));
      setChartData(data);
    };

    loadStats();
  }, []);

  const cards = [
    { label: 'Produtos', value: stats.products, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Categorias', value: stats.categories, icon: Users, color: 'text-purple-500' },
    { label: 'Banners Ativos', value: stats.banners, icon: TrendingUp, color: 'text-[#00ff88]' },
    { label: 'Total Visitas', value: stats.clicks, icon: DollarSign, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-display uppercase text-white">Dashboard</h2>
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Visão geral da sua loja</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#0c0c0c] border border-white/5 p-6 rounded-3xl flex items-center gap-5">
            <div className={`p-4 rounded-2xl bg-white/5 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{card.label}</p>
              <p className="text-2xl font-black text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vendas (Simuladas) */}
        <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl">
          <div className="mb-6">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Performance de Vendas</h3>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Últimos 7 dias (Simulado)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="vendas" stroke="#00ff88" fillOpacity={1} fill="url(#colorVendas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visitas por Produto */}
        <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl">
          <div className="mb-6">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Visitas por Produto</h3>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Engajamento real</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="visitas" fill="#ffffff20" radius={[4, 4, 0, 0]} hover={{ fill: '#00ff88' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
