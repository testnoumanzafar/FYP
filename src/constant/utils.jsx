//   const URL= http://localhost:4000
// export   const   URL="https://backend-fyp-1.onrender.com"
// // https://backend-fyp-1.onrender.com
// import { io } from "socket.io-client";
// const socket = io("https://backend-fyp-1.onrender.com",{
//   transports: ["websocket"], // optional but helps avoid polling issues
//   secure: true,
//   withCredentials: true,
// }); // Your backend port
// export default socket;

import { io } from "socket.io-client";

// Auto-detect if running locally
const isLocalhost = window.location.hostname === "localhost";

// Backend URL switcher
export const URL = isLocalhost
  ? "http://localhost:4000"              // Local backend
  : "https://backend-fyp-1.onrender.com" // Live backend

// Connect socket
const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket", "polling"], // Try WebSocket first, then fallback
});

// Connection success
socket.on("connect", () => {
  console.log(`✅ Socket connected to ${URL} with id: ${socket.id}`);
});

// Connection error handler
socket.on("connect_error", (err) => {
  console.error(`❌ Socket connection error:`, err.message);
  console.error(`   Possible cause: CORS or backend URL mismatch`);
});

// Disconnection handler
socket.on("disconnect", (reason) => {
  console.warn(`⚠️ Socket disconnected: ${reason}`);
});

export default socket;



// src/mock/mockGroups.js
export const mockGroups = [
  {
    _id: "group1",
    groupName: "React Developers",
    picture: { url: "https://via.placeholder.com/150?text=React+Group" },
  },
  {
    _id: "group2",
    groupName: "Gaming Legends",
    picture: { url: "https://via.placeholder.com/150?text=Gaming+Group" },
  },
];
