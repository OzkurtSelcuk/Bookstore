import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditBookModal = ({ book, onSave, onClose }) => {
  const [form, setForm] = useState({ ...book });

  useEffect(() => setForm({ ...book }), [book]);

  const inputStyle = { width: '100%', padding: '10px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '8px', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '30px', width: '400px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Kitabı Düzenle</h3>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Kitap Adı', key: 'title', type: 'text' },
            { label: 'Fiyat (₺)', key: 'price', type: 'number' },
            { label: 'Stok', key: 'stock', type: 'number' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>{label}</label>
              <input type={type} value={form[key]} style={inputStyle}
                onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <button onClick={() => onSave(form)}
            style={{ marginTop: '10px', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;