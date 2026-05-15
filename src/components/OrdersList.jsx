import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    try {
      const { data } = await supabase.from('orders').select('*').order('date', { ascending: false });
      setOrders(data || []);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { fetchOrders(); }, []);
  const handleStatusChange = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };
  return (
    <div className="card">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
            <th style={{ padding: '12px' }}>Produto</th>
            <th style={{ padding: '12px' }}>Data</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
              <td style={{ padding: '12px' }}>{order.productName}</td>
              <td style={{ padding: '12px' }}>{new Date(order.date).toLocaleString()}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: order.status === 'novo' ? '#e3f2fd' : '#f5f5f5', color: order.status === 'novo' ? '#1976d2' : '#757575' }}>
                  {order.status === 'novo' ? 'Novo' : 'Atendido'}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                {order.status === 'novo' && <button onClick={() => handleStatusChange(order._id, 'atendido')} style={{ padding: '4px 8px', fontSize: '12px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Atendido</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
