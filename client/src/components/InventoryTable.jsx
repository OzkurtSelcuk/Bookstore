import { Trash2, Pencil } from 'lucide-react';

const InventoryTable = ({ books, userRole, onDelete, onEdit, onAddToCart }) => (
  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
    <thead style={{ backgroundColor: '#334155' }}>
      <tr>
        <th style={{ padding: '15px' }}>Kitap</th>
        <th style={{ padding: '15px' }}>Fiyat</th>
        <th style={{ padding: '15px' }}>Stok</th>
        <th style={{ padding: '15px' }}>İşlem</th>
      </tr>
    </thead>
    <tbody>
      {books.map(book => (
        <tr key={book.id} style={{ borderBottom: '1px solid #334155' }}>
          <td style={{ padding: '15px' }}>{book.title}</td>
          <td style={{ padding: '15px', color: '#10b981' }}>₺{book.price}</td>
          <td style={{ padding: '15px', color: book.stock > 0 ? '#94a3b8' : '#ef4444' }}>
            {book.stock > 0 ? `${book.stock} Stok` : "Tükendi"}
          </td>
          <td style={{ padding: '15px' }}>
            {userRole === "admin" ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Pencil size={18} color="#f59e0b" style={{ cursor: 'pointer' }} onClick={() => onEdit(book)} />
                <Trash2 size={18} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => onDelete(book.id)} />
              </div>
            ) : (
              <button disabled={book.stock <= 0} onClick={() => onAddToCart(book)}
                style={{ backgroundColor: book.stock > 0 ? '#3b82f6' : '#475569', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: book.stock > 0 ? 'pointer' : 'not-allowed' }}>
                Sepete Ekle
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default InventoryTable;