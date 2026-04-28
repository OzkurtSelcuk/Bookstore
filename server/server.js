const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// --- KULLANICI DOSYASI ---
const USERS_FILE = path.join(__dirname, 'users.json');
const loadUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

let users = loadUsers();

// --- VERİ MODELİ ---
const initialData = {
    books: [
        { id: 1, title: "Saatleri Ayarlama Enstitüsü", author: "Ahmet Hamdi Tanpınar", price: 185, stock: 10 },
        { id: 2, title: "Benim Adım Kırmızı", author: "Orhan Pamuk", price: 210, stock: 5 },
        { id: 3, title: "Beyaz Kale", author: "Orhan Pamuk", price: 195, stock: 8 }
    ],
    revenue: [0, 0, 0,0, 0, 0,0,0, 0,0,0,0]
};

let currentData = JSON.parse(JSON.stringify(initialData));

// --- AUTH ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) res.json(user);
    else res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı!" });
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    users = loadUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "Bu kullanıcı adı zaten alınmış!" });
    }
    const newUser = { username, password, role: "user" };
    users.push(newUser);
    saveUsers(users);
    res.json(newUser);
});

// --- KULLANICI YÖNETİMİ ---
app.get('/api/users', (req, res) => {
    const safeUsers = loadUsers().map(({ password, ...u }) => u);
    res.json(safeUsers);
});

app.delete('/api/users/:username', (req, res) => {
    const { username } = req.params;
    if (username === "admin") return res.status(400).json({ message: "Admin silinemez!" });
    users = loadUsers().filter(u => u.username !== username);
    saveUsers(users);
    res.json({ success: true });
});

app.patch('/api/users/:username/role', (req, res) => {
    const { username } = req.params;
    const { role } = req.body;
    users = loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
    user.role = role;
    saveUsers(users);
    res.json({ success: true });
});

// --- KİTAP ENDPOINTLERİ ---
app.get('/api/inventory', (req, res) => {
    res.json(currentData);
});

app.post('/api/books', (req, res) => {
    const { title, author, price, stock } = req.body;
    const newBook = {
        id: Date.now(),
        title,
        author: author || "Bilinmiyor",
        price: Number(price),
        stock: Number(stock) || 0
    };
    currentData.books.push(newBook);
    res.json(newBook);
});

app.patch('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = currentData.books.find(b => b.id === id);
    if (!book) return res.status(404).json({ message: "Kitap bulunamadı!" });
    const { title, price, stock } = req.body;
    if (title !== undefined) book.title = title;
    if (price !== undefined) book.price = Number(price);
    if (stock !== undefined) book.stock = Number(stock);
    res.json({ success: true, book });
});

app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    currentData.books = currentData.books.filter(b => b.id !== id);
    res.json({ success: true });
});

app.post('/api/buy-book/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = currentData.books.find(b => b.id === id);
    
    if (book && book.stock > 0) {
        book.stock -= 1;
        
        // Satış gelirini bu aya ekle
        const currentMonth = new Date().getMonth(); // 0-11
        currentData.revenue[currentMonth] += book.price;
        
        res.json({ success: true, newStock: book.stock });
    } else {
        res.status(400).json({ message: "Stok yetersiz!" });
    }
});

app.post('/api/return-book/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = currentData.books.find(b => b.id === id);
    if (book) {
        book.stock += 1;
        res.json({ success: true, newStock: book.stock });
    } else {
        res.status(404).json({ message: "Kitap bulunamadı!" });
    }
});

app.post('/api/admin-reset', (req, res) => {
    currentData = JSON.parse(JSON.stringify(initialData));
    res.json({ message: "Sistem sıfırlandı!" });
});

// --- SERVER BAŞLAT ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`
    =========================================
    Bookstore Backend Hizmeti Başlatıldı
    Port: ${PORT}
    Admin Kullanıcı: admin / 123
    Normal Kullanıcı: selcuk / 123
    =========================================
    `);
});