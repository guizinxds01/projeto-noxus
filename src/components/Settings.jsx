import React from 'react';
import { useConfig } from '../ConfigContext';
import { supabase } from '../lib/supabase';
import { Ticket } from 'lucide-react';

const Settings = () => {
  const { config, updateConfig } = useConfig();
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = `logo-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      updateConfig({ ...config, [field]: publicUrl });
    } catch (e) {
      alert('Erro no upload: ' + e.message);
    }
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      <div className="card">
        <h3>Identidade</h3>
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          <div>
            <label>Nome da Loja</label>
            <input type="text" value={config.name} onChange={e => updateConfig({ ...config, name: e.target.value })} />
          </div>
          <div>
            <label>Logo</label>
            <input type="file" onChange={e => handleFileUpload(e, 'logo')} />
            {config.logo && <img src={`${config.logo}`} style={{ height: '40px', marginTop: '10px' }} />}
          </div>
        </div>
      </div>
      <div className="card">
        <h3>SEO</h3>
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          <div>
            <label>Título SEO</label>
            <input type="text" value={config.seoTitle} onChange={e => updateConfig({ ...config, seoTitle: e.target.value })} />
          </div>
          <div>
            <label>Descrição SEO</label>
            <textarea rows="4" value={config.seoDescription} onChange={e => updateConfig({ ...config, seoDescription: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(12,12,12,0.9) 0%, rgba(20,20,20,0.9) 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Ticket size={20} style={{ color: '#00ff88' }} />
          Cupom de Desconto Ativo
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '5px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
          Configure o cupom global que os clientes poderão aplicar no carrinho de compras.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '25px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '900', uppercase: true, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Código do Cupom</label>
            <input 
              type="text" 
              placeholder="Ex: NOXUS10" 
              value={config.couponCode || ''} 
              onChange={e => updateConfig({ ...config, couponCode: e.target.value.toUpperCase().replace(/\s/g, '') })}
              style={{ width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '900', uppercase: true, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Porcentagem de Desconto (%)</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              placeholder="Ex: 10" 
              value={config.couponDiscount || ''} 
              onChange={e => {
                const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                updateConfig({ ...config, couponDiscount: String(val) });
              }}
              style={{ width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
