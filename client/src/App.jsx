import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import * as api from './api/api';
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import RevenueChart from './components/RevenueChart';
import AddBookForm from './components/AddBookForm';
import InventoryTable from './components/InventoryTable';
import EditBookModal from './components/EditBookModal';
import CartPanel from './components/CartPanel';
import { Users, Trash2 } from 'lucide-react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || "");
  const [username, setUsername] = useState(() => localStorage.getItem('username') || "");
  const [activeTab, setActiveTab] = useState("inventory");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [data, setData] = useState({ books: [], revenue: [] });
  const [cart, setCart] = useState([]);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [users, setUsers] = useState([]);
  const [editBook, setEditBook] = useState(null);

  const fetchData = async () => {
    const res = await api.getInventory();
    setData(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      if (userRole === "admin") fetchUsers();
    }
  }, [isLoggedIn]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const res = isRegistering
        ? await api.register(authForm)
        : await api.login(authForm);
      if (isRegistering) { alert("Kayıt başarılı!"); setIsRegistering(false); return; }
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('username', res.data.username);
      setIsLoggedIn(true); setUserRole(res.data.role); setUsername(res.data.username);
    } catch { alert("İşlem başarısız!"); }
  };

  const handleAddBook = async (form) => {
    await api.addBook(form);
    fetchData();
  };

  const handleDeleteBook = async (id) => {
    await api.deleteBook(id);
    fetchData();
  };

  const handleEditBook = async (form) => {
    await api.updateBook(form.id, { title: form.title, price: Number(form.price), stock: Number(form.stock) });
    setEditBook(null);
    fetchData();
  };

  const handleAddToCart = async (book) => {
    await api.buyBook(book.id);
    setCart([...cart, { ...book, cartId: Date.now() }]);
    fetchData();
  };

  const handleRemoveFromCart = async (item) => {
    await api.returnBook(item.id);
    setCart(cart.filter(c => c.cartId !== item.cartId));
    fetchData();
  };

  const handleCheckout = () => {
    alert("Sipariş alındı!");
    setCart([]);
    setIsCartOpen(false);
  };

  const handleDeleteUser = async (uname) => {
    if (!window.confirm(`${uname} silinsin mi?`)) return;
    try { await api.deleteUser(uname); fetchUsers(); }
    catch (err) { alert(err.response?.data?.message || "Hata!"); }
  };

  const handleToggleRole = async (uname, currentRole) => {
    await api.updateUserRole(uname, currentRole === "admin" ? "user" : "admin");
    fetchUsers();
  };

  const handleLogout = () => { localStorage.clear(); window.location.reload(); };

  // LOGIN
  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px', width: '350px', border: '1px solid #334155' }}>
          <h2 style={{ color: '#f1f5f9', textAlign: 'center', marginBottom: '20px' }}>
            {isRegistering ? "Yeni Üyelik" : "Bookstore AI"}
          </h2>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Kullanıcı Adı" required
              style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155' }}
              onChange={e => setAuthForm({...authForm, username: e.target.value})} />
            <input type="password" placeholder="Şifre" required
              style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155' }}
              onChange={e => setAuthForm({...authForm, password: e.target.value})} />
            <button type="submit"
              style={{ padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isRegistering ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </form>
          <p onClick={() => setIsRegistering(!isRegistering)}
            style={{ color: '#3b82f6', textAlign: 'center', marginTop: '20px', cursor: 'pointer' }}>
            {isRegistering ? "Vazgeç" : "Hesabın yok mu? Kayıt Ol"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); if (tab === "users") fetchUsers(); }}
        userRole={userRole} username={username} onLogout={handleLogout} />

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0 }}>
            {activeTab === "home" ? "Genel Bakış" : activeTab === "users" ? "Kullanıcı Yönetimi" : "Kitap Listesi"}
          </h1>
          {userRole !== "admin" && (
            <div onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative', cursor: 'pointer', backgroundColor: '#1e293b', padding: '10px', borderRadius: '50%' }}>
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#ef4444', padding: '2px 6px', borderRadius: '50%', fontSize: '12px' }}>
                  {cart.length}
                </span>
              )}
            </div>
          )}
        </header>

        {activeTab === "home" && (
          <div>
            <StatCards books={data.books} userRole={userRole} username={username} userCount={users.length} />
            {userRole === "admin" && <RevenueChart revenueData={data.revenue} />}
          </div>
        )}

        {activeTab === "inventory" && (
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden' }}>
            {userRole === "admin" && <AddBookForm onAdd={handleAddBook} />}
            <InventoryTable books={data.books} userRole={userRole}
              onDelete={handleDeleteBook} onEdit={setEditBook} onAddToCart={handleAddToCart} />
          </div>
        )}

        {activeTab === "users" && userRole === "admin" && (
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#334155' }}>
                <tr>
                  <th style={{ padding: '15px' }}>Kullanıcı Adı</th>
                  <th style={{ padding: '15px' }}>Rol</th>
                  <th style={{ padding: '15px' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.username} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '15px' }}>{u.username}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ backgroundColor: u.role === "admin" ? '#7c3aed' : '#0369a1', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                      {u.username !== "admin" ? (
                        <>
                          <button onClick={() => handleToggleRole(u.username, u.role)}
                            style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>
                            {u.role === "admin" ? "User Yap" : "Admin Yap"}
                          </button>
                          <button onClick={() => handleDeleteUser(u.username)}
                            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>
                            Sil
                          </button>
                        </>
                      ) : <span style={{ color: '#64748b', fontSize: '12px' }}>Korumalı</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {editBook && <EditBookModal book={editBook} onSave={handleEditBook} onClose={() => setEditBook(null)} />}
      {isCartOpen && <CartPanel cart={cart} onRemove={handleRemoveFromCart} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />}

      {userRole === "admin" && (
        <button onClick={() => api.adminReset().then(fetchData)}
          style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ef4444', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', zIndex: 50 }}>
          Sıfırla (Alt+R)
        </button>
      )}
    </div>
  );
};

export default App;