'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

// ตั้งค่า axios base URL
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // ตรวจสอบ token เมื่อ component mount
  useEffect(() => {
    const savedToken = Cookies.get('token');
    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // ดึงข้อมูลผู้ใช้
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // ถ้า token ไม่ถูกต้อง ให้ลบออก
      logout();
    } finally {
      setLoading(false);
    }
  };

  // เข้าสู่ระบบ
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { user: userData, token: newToken } = response.data.data;
      
      // บันทึก token ใน cookie
      Cookies.set('token', newToken, { expires: 7 }); // 7 วัน
      
      // ตั้งค่า axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setUser(userData);
      setToken(newToken);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      return { success: false, message };
    }
  };

  // สมัครสมาชิก
  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });

      const { user: userData, token: newToken } = response.data.data;
      
      // บันทึก token ใน cookie
      Cookies.set('token', newToken, { expires: 7 });
      
      // ตั้งค่า axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setUser(userData);
      setToken(newToken);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      return { success: false, message };
    }
  };

  // ออกจากระบบ
  const logout = () => {
    Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
