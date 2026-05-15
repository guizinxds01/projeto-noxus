import React from 'react';
import { useConfig } from '../ConfigContext';

const Settings = () => {
  const { config, updateConfig } = useConfig();
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    updateConfig({ ...config, [field]: data.url });
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
    </div>
  );
};

export default Settings;
