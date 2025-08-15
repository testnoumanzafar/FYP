// // src/components/ChatHeader.jsx
// import React from 'react';
// import { useUsers } from '../context/UserContext';
// import { useVideoCall } from '../context/VideoCallContext';
// import { FaVideo, FaPhone } from 'react-icons/fa';

// const ChatHeader = ({ userId, groupId = null, isGroupChat = false }) => {
//   const { onlineStatus } = useUsers();
//   const { initiateCall } = useVideoCall();
  
//   const isOnline = onlineStatus[userId] === 'online'; 
//   const Username = localStorage.getItem("Cusername");

//   const handleVideoCall = () => {
//     if (isGroupChat && groupId) {
//       // Group video call
//       initiateCall(null, null, true, groupId);
//     } else if (userId) {
//       // 1-on-1 video call
//       initiateCall(userId, Username, false);
//     }
//   };

//   return (
//     <div className="border-b border-gray-200 px-6 py-1.5 flex items-center justify-between">
//       <div>
//         <div className="font-semibold text-lg">{Username}</div>
//         {!isGroupChat && (
//           <div className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
//             {isOnline ? 'Online' : 'Offline'}
//           </div>
//         )}
//         {isGroupChat && (
//           <div className="text-sm text-blue-500">Group Chat</div>
//         )}






//       </div>
      
//       <div className="flex space-x-2">
//         <button 
//           onClick={handleVideoCall}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center space-x-2 transition-colors"
//           title="Start Video Call"
//         >
//           <FaVideo size={14} />
//           <span>Video Call</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;









// src/components/ChatHeader.jsx
import React, { useEffect, useState } from "react";
import socket, { URL } from "../constant/utils";
import { useUsers } from "../context/UserContext";
import { useVideoCall } from "../context/VideoCallContext";
import { FaVideo, FaUsers, FaTimes } from "react-icons/fa";
import axios from "axios";

const ChatHeader = ({ userId, groupId = null, isGroupChat = false }) => {
  const { onlineStatus } = useUsers();
  const { initiateCall } = useVideoCall();

  const Username = localStorage.getItem("Cusername");
  const isOnline = onlineStatus[userId] === "online";

  const [members, setMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch group members when groupId changes
  useEffect(() => {
    if (isGroupChat && groupId) {
      socket.emit("getGroupMembers", groupId);
    }

    socket.on("groupMembers", (data) => {
      if (data.groupId === groupId) {
        setMembers(data.members);
      }
    });

    return () => {
      socket.off("groupMembers");
    };
  }, [groupId, isGroupChat]);

  // Update online status for members
  useEffect(() => {
    socket.on("updateUserStatus", ({ userId, status }) => {
      setMembers((prev) =>
        prev.map((m) =>
          m._id === userId ? { ...m, online: status === "online" } : m
        )
      );
    });

    return () => {
      socket.off("updateUserStatus");
    };
  }, []);

  const handleVideoCall = () => {
    if (isGroupChat && groupId) {
      initiateCall(null, null, true, groupId); // Group call
    } else if (userId) {
      initiateCall(userId, Username, false); // 1-on-1 call
    }
  };


const handleRemoveUser = async (userIdToRemove) => {
  try {
    const res = await axios.delete(
      `${URL}/api/groups/${groupId}/members/${userIdToRemove}`
    );

    if (res.data.success) {
      setMembers((prev) => prev.filter((m) => m._id !== userIdToRemove));
    } else {
      alert(res.data.error || "Failed to remove user");
    }
  } catch (err) {
    console.error(err);
    alert("Error removing user");
  }
};


  return (
    <div className="border-b border-gray-200 px-6 py-1.5 flex items-center justify-between relative">
      <div>
        <div className="font-semibold text-lg">{Username}</div>
        {!isGroupChat && (
          <div
            className={`text-sm ${
              isOnline ? "text-green-500" : "text-gray-400"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </div>
        )}
        {isGroupChat && (
          <div className="flex items-center gap-3 text-sm text-blue-500">
            <span>Group Chat</span>
            <span className="text-gray-600">{members.length} members</span>
            <FaUsers
              className="cursor-pointer text-gray-700 hover:text-gray-900"
              onClick={() => setShowPopup(true)}
            />
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleVideoCall}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center space-x-2 transition-colors"
          title="Start Video Call"
        >
          <FaVideo size={14} />
          <span>Video Call</span>
        </button>
      </div>

      {/* Group members popup */}
      {isGroupChat && showPopup && (
        <div className="absolute top-14 right-10 bg-white border rounded-lg shadow-lg p-4 w-64 z-50">
          <h3 className="font-semibold mb-3">Group Members</h3>
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m._id} className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-full ${
                    m.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                {m.name}

 {(
            localStorage.getItem("Cuseremail") === "nouman@gmail.com" ||
            localStorage.getItem("CuserId") === "6860e2e85547033af89987ba"
          ) && m._id !== localStorage.getItem("CuserId") && (
            <FaTimes
              className="text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => handleRemoveUser(m._id)}
            />
          )}



              </li>
            ))}
          </ul>
          <button
            className="mt-3 cursor-pointer text-sm text-blue-500"
            onClick={() => setShowPopup(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
