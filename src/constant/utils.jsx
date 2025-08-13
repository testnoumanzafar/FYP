//   const URL= http://localhost:4000
export   const   URL="https://backend-fyp-1.onrender.com"

import { io } from "socket.io-client";
const socket = io("https://backend-fyp-1.onrender.com",{
  transports: ["websocket"], // optional but helps avoid polling issues
}); // Your backend port
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
