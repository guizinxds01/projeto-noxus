import React from 'react';
import { useConfig } from '../ConfigContext';

const WhatsAppConfig = () => {
  const { config, updateConfig } = useConfig();
  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h3>Configuração do WhatsApp</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label>Número do WhatsApp</label>
          <input type="text" placeholder="5511999999999" value={config.whatsappNumber} onChange={e => updateConfig({ ...config, whatsappNumber: e.target.value })} />
        </div>
        <div>
          <label>Mensagem Padrão</label>
          <textarea rows="4" value={config.whatsappMessage} onChange={e => updateConfig({ ...config, whatsappMessage: e.target.value })} />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConfig;
