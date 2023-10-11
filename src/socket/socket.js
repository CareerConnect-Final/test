import io from "socket.io-client";

const socketService = {
  socket: null,

  connect: (token) => {
    socketService.socket = io("https://final-backend-nvf1.onrender.com/");

    socketService.socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socketService.socket.emit("sendToken", { token });
      const socketId = socketService.socket.id;
      localStorage.setItem("socketId", socketId);
    });

    // socketService.socket.on("newNotification", (notification) => {
    //   console.log("New notification:", notification);
    // });
  },

  disconnect: () => {
    if (socketService.socket) {
      socketService.socket.disconnect();
      localStorage.removeItem("socketId");
      localStorage.removeItem("socketToken");
    }
  },

  onConnect: (callback) => {
    if (socketService.socket) {
      socketService.socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
        callback();
      });
    }
  },

  onDisconnect: (callback) => {
    if (socketService.socket) {
      socketService.socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
        callback();
      });
    }
  },
  // Add other Socket.io event listeners and emitters as needed
  // Register custom event listeners
  addEventListener: (eventName, callback) => {
    if (socketService.socket) {
      socketService.socket.on(eventName, callback);
    }
  },

  // Remove custom event listeners
  removeEventListener: (eventName, callback) => {
    if (socketService.socket) {
      socketService.socket.off(eventName, callback);
    }
  },

  // Emit custom events
  emitEvent: (eventName, data) => {
    if (socketService.socket) {
      socketService.socket.emit(eventName, data);
    }
  },
};

export default socketService;
