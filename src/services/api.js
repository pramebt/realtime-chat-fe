import axios from 'axios';

// ตั้งค่า base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// สร้าง axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// เพิ่ม interceptor สำหรับจัดการ token
api.interceptors.request.use(
  (config) => {
    // Read token from localStorage first, then from cookies (same as AuthContext)
    const token = localStorage.getItem('token') || document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// เพิ่ม interceptor สำหรับจัดการ response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token หมดอายุหรือไม่ถูกต้อง - ลบจาก localStorage และ cookies
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions สำหรับ Rooms
export const roomAPI = {
  // ✅ สร้างห้อง
  createRoom: async (name) => {
    const response = await api.post('/api/rooms', { name });
    return response.data;
  },

  // ✅ ดึงรายการห้องที่เห็นได้
  getRooms: async () => {
    const response = await api.get('/api/rooms');
    return response.data;
  },

  // ✅ เข้าร่วมห้องด้วยโค้ด
  joinByCode: async (code) => {
    const response = await api.post('/api/rooms/join', { code });
    return response.data;
  },

  // ✅ อัปเดตชื่อห้อง
  updateRoom: async (id, name) => {
    const response = await api.put(`/api/rooms/${id}`, { name });
    return response.data;
  },

  // ✅ ลบห้อง
  deleteRoom: async (id) => {
    const response = await api.delete(`/api/rooms/${id}`);
    return response.data;
  },
};
// API functions สำหรับ Messages
export const messageAPI = {
  // ✅ ส่งข้อความ
  sendMessage: async (content, roomId, userId) => {
    const response = await api.post('/api/messages/send-message', {
      content,
      roomId,
      userId
    });
    return response.data;
  },

  // ✅ ดึงข้อความในห้อง
  getMessages: async (roomId) => {
    const response = await api.get(`/api/messages/get-messages/${roomId}`);
    return response.data;
  },
  // ✅ แก้ไขข้อความ
  editMessage: async (id, content) => {
    const response = await api.put(`/api/messages/edit-message/${id}` , { content });
    return response.data;
  },
  // ✅ ลบข้อความ
  deleteMessage: async (id) => {
    const response = await api.delete(`/api/messages/delete-message/${id}`);
    return response.data;
  },
  // ✅ ทำเครื่องหมายว่าอ่านแล้ว
  readMessage: async (id) => {
    const response = await api.post(`/api/messages/read-message/${id}`);
    return response.data;
  },
};

// API functions สำหรับ Users
export const userAPI = {
  // ✅ ดึงข้อมูลโปรไฟล์
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
};

export default api;
