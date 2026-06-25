import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const API = 'http://localhost:8000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [foto, setFoto] = useState(() => {
    const saved = localStorage.getItem('user');
    const u = saved ? JSON.parse(saved) : null;
    return u?.foto_profil ?? null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API}/me`)
        .then(res => {
          setUser(res.data);
          setFoto(res.data.foto_profil ?? null);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
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
    setFoto(user.foto_profil ?? null);
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

  const updateProfile = async (name, fotoProfil, email) => {
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (email !== undefined) payload.email = email;
    if (fotoProfil !== undefined) payload.foto_profil = fotoProfil;

    const res = await axios.put(`${API}/profile`, payload);
    const updated = res.data;
    setUser(updated);
    setFoto(updated.foto_profil ?? null);
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  };

  const updatePassword = async (passwordLama, passwordBaru, konfirmasi) => {
    const res = await axios.put(`${API}/password`, {
      password_lama: passwordLama,
      password_baru: passwordBaru,
      konfirmasi,
    });
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, foto, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
