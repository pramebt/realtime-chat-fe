import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // เชื่อมต่อ Socket.IO
  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    // Event listeners
    this.socket.on('connect', () => {
      console.log('✅ Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }
  // รายชื่อผู้ที่ออนไลน์เริ่มต้น
  onOnlineUsers(callback) {
    if (this.socket) {
      this.socket.on('online-users', callback);
    }
  }
  onlineUser(callback) {
    if (this.socket) {
      this.socket.on('user-online', callback);
    }
  }
  offlineUser(callback) {
    if (this.socket) {
      this.socket.on('user-offline', callback);
    }
  }
  // ตัดการเชื่อมต่อ
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // เข้าร่วมห้อง
  joinRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-room', roomId);
    }
  }

  // ออกจากห้อง
  leaveRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-room', roomId);
    }
  }

  // ส่งข้อความ
  sendMessage(roomId, message) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', {
        roomId,
        message
      });
    }
  }

  // ฟังข้อความใหม่
  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive-message', callback);
    }
  }

  // ฟังเมื่อผู้ใช้เข้าร่วมห้อง
  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  // ฟังเมื่อผู้ใช้ออกจากห้อง
  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  // ฟังข้อผิดพลาด
  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }
 
  // ส่งการแจ้งเตือนว่ากำลังพิมพ์
  startTyping(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', roomId);
    }
  }

  // ส่งการแจ้งเตือนว่าหยุดพิมพ์
  stopTyping(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('stop-typing', roomId);
    }
  }

  // ฟังเมื่อมีคนกำลังพิมพ์
  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }
 
  // ฟังเมื่อมีคนหยุดพิมพ์
  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }
  // ฟังเมื่อมีคนอ่านข้อความ
  onReadMessage(callback) {
    if (this.socket) {
      this.socket.on('message-read', callback);
    }
  }

  // แจ้งว่าอ่านข้อความแล้ว
  readMessage(messageId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('read-message', { messageId });
    }
  }

  // แก้ไขข้อความผ่าน socket
  editMessage(messageId, content) {
    if (this.socket && this.isConnected) {
      this.socket.emit('edit-message', { messageId, content });
    }
  }

  // ลบข้อความผ่าน socket
  deleteMessage(messageId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('delete-message', { messageId });
    }
  }

  // ฟังผลลัพธ์การแก้ไข/ลบข้อความ
  onMessageEdited(callback) {
    if (this.socket) {
      this.socket.on('message-edited', callback);
    }
  }

  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on('message-deleted', callback);
    }
  }


  // ลบ event listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // ตรวจสอบสถานะการเชื่อมต่อ
  getConnectionStatus() {
    return this.isConnected;
  }
}

// สร้าง instance เดียว
const socketService = new SocketService();

export default socketService;
