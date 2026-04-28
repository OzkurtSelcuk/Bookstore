const Card = ({ label, value }) => (
  <div style={{ flex: 1, minWidth: '150px', backgroundColor: '#1e293b', padding: '25px', borderRadius: '16px' }}>
    <p style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '13px' }}>{label}</p>
    <h2 style={{ margin: 0, fontSize: '28px' }}>{value}</h2>
  </div>
);

const StatCards = ({ books, userRole, username, userCount }) => (
  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
    <Card label="Toplam Kitap" value={books.length} />
    <Card label="Toplam Stok" value={books.reduce((s, b) => s + b.stock, 0)} />
    {userRole === "admin" && <Card label="Kullanıcı Sayısı" value={userCount} />}
    <Card label="Hoş geldin" value={username} />
  </div>
);

export default StatCards;