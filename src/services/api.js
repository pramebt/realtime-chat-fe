import axios from 'axios';

// ==================== CONFIGURATION ====================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== INTERCEPTORS ====================

// Request interceptor - เพิ่ม token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - จัดการ error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== ROOM API ====================

export const roomAPI = {
  // ดึงรายการห้องทั้งหมด
  getRooms: async () => {
    const response = await api.get('/api/rooms/get-rooms');
    return response.data;
  },

  // สร้างห้องพร้อมรหัส
  createRoomWithCode: async (name) => {
    const response = await api.post('/api/rooms/create-room-with-code', { name });
    return response.data;
  },

  // เข้าร่วมห้องด้วยรหัส
  joinByCode: async (roomCode) => {
    const response = await api.post('/api/rooms/join-room-by-code', { roomCode });
    return response.data;
  },

  // สร้างห้อง private 1-on-1
  createPrivateRoom: async (targetUserId) => {
    const response = await api.post('/api/rooms/create-private-room', { 
      targetUserId: parseInt(targetUserId) 
    });
    return response.data;
  },

  // ดึงรายชื่อห้อง private ของผู้ใช้
  getPrivateRooms: async () => {
    const response = await api.get('/api/rooms/get-private-rooms');
    return response.data;
  },

  // อัปเดตห้อง
  updateRoom: async (id, name) => {
    const response = await api.put(`/api/rooms/update-room/${id}`, { name });
    return response.data;
  },

  // ลบห้อง
  deleteRoom: async (id) => {
    const response = await api.delete(`/api/rooms/delete-room/${id}`);
    return response.data;
  },
};

// ==================== MESSAGE API ====================

export const messageAPI = {
  // ส่งข้อความ
  sendMessage: async (content, roomId, userId) => {
    const response = await api.post('/api/messages/send-message', {
      content,
      roomId,
      userId
    });
    return response.data;
  },

  // ดึงข้อความในห้อง
  getMessages: async (roomId) => {
    const response = await api.get(`/api/messages/get-messages/${roomId}`);
    return response.data;
  },
};

// ==================== USER API ====================

export const userAPI = {
  // ดึงข้อมูลโปรไฟล์
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // ดึงรายชื่อผู้ใช้ทั้งหมด
  getUsers: async () => {
    const response = await api.get('/api/auth/users');
    return response.data;
  },
};

export default api;