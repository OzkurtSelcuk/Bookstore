import { Home, Package, LogOut, LayoutDashboard, Users } from 'lucide-react';

const NavItem = ({ label, icon, active, onClick }) => (
  <div onClick={onClick} style={{
    padding: '12px', cursor: 'pointer', borderRadius: '10px',
    backgroundColor: active ? "#3b82f6" : "transparent",
    display: 'flex', gap: '10px', alignItems: 'center'
  }}>
    {icon} {label}
  </div>
);

const Sidebar = ({ activeTab, setActiveTab, userRole, username, onLogout }) => {
  return (
    <aside style={{ width: '240px', backgroundColor: '#1e293b', padding: '25px', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ color: '#3b82f6', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <LayoutDashboard size={20} /> Bookstore
      </h2>
      <nav style={{ marginTop: '40px', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <NavItem label="Dashboard" icon={<Home size={18} />} active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <NavItem label="Envanter" icon={<Package size={18} />} active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} />
        {userRole === "admin" && (
          <NavItem label="Kullanıcılar" icon={<Users size={18} />} active={activeTab === "users"} onClick={() => setActiveTab("users")} />
        )}
      </nav>
      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>
        {username} ({userRole})
      </div>
      <button onClick={onLogout} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 0' }}>
        <LogOut size={16} /> Oturumu Kapat
      </button>
    </aside>
  );
};

export default Sidebar;