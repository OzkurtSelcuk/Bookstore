import { X, Trash2 } from 'lucide-react';

const CartPanel = ({ cart, onRemove, onClose, onCheckout }) => (
  <div style={{
    position: 'fixed', top: 0, right: 0,
    width: '350px', height: '100vh',
    backgroundColor: '#1e293b',
    borderLeft: '1px solid #334155',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
  }}>
    {/* HEADER */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', borderBottom: '1px solid #334155' }}>
      <h3 style={{ margin: 0 }}>Alışveriş Sepeti</h3>
      <X onClick={onClose} style={{ cursor: 'pointer' }} />
    </div>

    {/* ÜRÜN LİSTESİ */}
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 25px' }}>
      {cart.length === 0
        ? <p style={{ color: '#94a3b8', marginTop: '20px' }}>Sepetin boş...</p>
        : cart.map(item => (
          <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #334155' }}>
            <div>
              <p style={{ margin: 0 }}>{item.title}</p>
              <small style={{ color: '#10b981' }}>₺{item.price}</small>
            </div>
            <Trash2 size={16} color="#ef4444" onClick={() => onRemove(item)} style={{ cursor: 'pointer', flexShrink: 0 }} />
          </div>
        ))
      }
    </div>

    {/* ALT KISIM - TOPLAM + BUTON */}
    <div style={{ padding: '20px 25px', borderTop: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <span>Toplam:</span>
        <span style={{ fontWeight: 'bold', fontSize: '20px' }}>
          ₺{cart.reduce((s, i) => s + Number(i.price), 0)}
        </span>
      </div>
      <button onClick={onCheckout}
        style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
        Siparişi Tamamla
      </button>
    </div>
  </div>
);

export default CartPanel;