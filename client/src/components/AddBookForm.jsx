import { useState } from 'react';

const AddBookForm = ({ onAdd }) => {
  const [form, setForm] = useState({ title: "", price: "", stock: "" });

  const handleAdd = () => {
    if (!form.title || !form.price || !form.stock) return alert("Tüm alanları doldurun!");
    onAdd(form);
    setForm({ title: "", price: "", stock: "" });
  };

  const inputStyle = { padding: '10px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '5px' };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '10px', borderBottom: '1px solid #334155' }}>
      <input placeholder="Ad" value={form.title} style={{ ...inputStyle, flex: 2 }}
        onChange={e => setForm({...form, title: e.target.value})} />
      <input type="number" placeholder="Fiyat" value={form.price} style={{ ...inputStyle, flex: 1 }}
        onChange={e => setForm({...form, price: e.target.value})} />
      <input type="number" placeholder="Stok" value={form.stock} style={{ ...inputStyle, flex: 1 }}
        onChange={e => setForm({...form, stock: e.target.value})} />
      <button onClick={handleAdd}
        style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0 20px', borderRadius: '5px', cursor: 'pointer' }}>
        Ekle
      </button>
    </div>
  );
};

export default AddBookForm;