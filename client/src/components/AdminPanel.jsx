import React, { useState } from 'react';
import Dashboard from './Dashboard';
import ProductManager from './ProductManager';
import BannerManager from './BannerManager';
import AppearanceEditor from './AppearanceEditor';
import Settings from './Settings';
import WhatsAppConfig from './WhatsAppConfig';
import CategoryManager from './CategoryManager';
import OrdersList from './OrdersList';
import LookbookManager from './LookbookManager';
import { 
  LayoutDashboard, 
  Package, 
  ListTree, 
  Image as ImageIcon, 
  Camera,
  Palette, 
  Settings as SettingsIcon, 
  MessageSquare, 
  ShoppingBag,
  ExternalLink,
  LogOut
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard',   label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'products',    label: 'Produtos',        icon: Package },
  { id: 'categories',  label: 'Categorias',      icon: ListTree },
  { id: 'banners',     label: 'Banners',         icon: ImageIcon },
  { id: 'lookbook',    label: 'Modelagem',       icon: Camera },
  { id: 'orders',      label: 'Pedidos',         icon: ShoppingBag },
  { id: 'appearance',  label: 'Personalização',  icon: Palette },
  { id: 'whatsapp',    label: 'WhatsApp',        icon: MessageSquare },
  { id: 'settings',    label: 'Configurações',   icon: SettingsIcon },
];

const AdminPanel = ({ onExit, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed h-full z-10">
        <div className="p-8">
          <h1 className="text-xl font-black tracking-tighter uppercase italic">NOXUS ADMIN</h1>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto space-y-2">
          <button
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
            Ver Loja
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
            Deslogar
          </button>
        </div>
      </div>

      {/* Main Content — todos os painéis ficam montados, só a visibilidade muda */}
      <div className="flex-1 ml-64 bg-[#050505] min-h-screen">
        <div className="max-w-7xl mx-auto p-8">
          <div style={{ display: activeTab === 'dashboard'  ? 'block' : 'none' }}><Dashboard /></div>
          <div style={{ display: activeTab === 'products'   ? 'block' : 'none' }}><ProductManager /></div>
          <div style={{ display: activeTab === 'categories' ? 'block' : 'none' }}><CategoryManager /></div>
          <div style={{ display: activeTab === 'banners'    ? 'block' : 'none' }}><BannerManager /></div>
          <div style={{ display: activeTab === 'lookbook'   ? 'block' : 'none' }}><LookbookManager /></div>
          <div style={{ display: activeTab === 'orders'     ? 'block' : 'none' }}><OrdersList /></div>
          <div style={{ display: activeTab === 'appearance' ? 'block' : 'none' }}><AppearanceEditor /></div>
          <div style={{ display: activeTab === 'whatsapp'   ? 'block' : 'none' }}><WhatsAppConfig /></div>
          <div style={{ display: activeTab === 'settings'   ? 'block' : 'none' }}><Settings /></div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
