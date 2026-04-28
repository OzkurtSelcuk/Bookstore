import axios from 'axios';

const BASE = 'http://localhost:5000/api';

export const login = (form) => axios.post(`${BASE}/login`, form);
export const register = (form) => axios.post(`${BASE}/register`, form);
export const getInventory = () => axios.get(`${BASE}/inventory`);
export const getUsers = () => axios.get(`${BASE}/users`);
export const addBook = (book) => axios.post(`${BASE}/books`, book);
export const updateBook = (id, book) => axios.patch(`${BASE}/books/${id}`, book);
export const deleteBook = (id) => axios.delete(`${BASE}/books/${id}`);
export const deleteUser = (username) => axios.delete(`${BASE}/users/${username}`);
export const updateUserRole = (username, role) => axios.patch(`${BASE}/users/${username}/role`, { role });
export const buyBook = (id) => axios.post(`${BASE}/buy-book/${id}`);
export const returnBook = (id) => axios.post(`${BASE}/return-book/${id}`);
export const adminReset = () => axios.post(`${BASE}/admin-reset`);