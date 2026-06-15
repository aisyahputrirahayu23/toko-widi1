import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const API = 'http://localhost:8000/api';

const fotoKey = (id) => id ? `userFoto_${id}` : null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [foto, setFoto] = useState(() => {
    const saved = localStorage.getItem('user');
    const u = saved ? JSON.parse(saved) : null;
    const key = fotoKey(u?.id);
    return key ? (localStorage.getItem(key) ?? null) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = fotoKey(user?.id);
    setFoto(key ? (localStorage.getItem(key) ?? null) : null);
  }, [user?.id]);

  const setFotoUser = (dataUrl) => {
    const saved = localStorage.getItem('user');
    const currentUser = saved ? JSON.parse(saved) : null;
    const key = fotoKey(currentUser?.id);
    if (key) {
      try {
        if (dataUrl) {
          localStorage.setItem(key, dataUrl);
        } else {
          localStorage.removeItem(key);
        }
      } catch (_) {}
    }
    setFoto(dataUrl);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API}/me`)
        .then(res => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/login`, { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    const key = fotoKey(user?.id);
    setFoto(key ? (localStorage.getItem(key) ?? null) : null);
    return user;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/logout`);
    } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setFoto(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, foto, setFotoUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
