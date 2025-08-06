// src/components/ChatHeader.jsx
import React from 'react';
import { useUsers } from '../context/UserContext';

const ChatHeader = ({ userId}) => {
  // console.log(name);
  
  const { onlineStatus } = useUsers(); // 🔥 Access online map
  const isOnline = onlineStatus[userId] === 'online'; 
  //  const Username = name?.name || "Group";
  // const isOnline = name?.status === "online";
  // console.log(isOnline,"check");
  
 ;
const Username=  localStorage.getItem("Cusername");
  return (
    <div className="border-b border-gray-200 px-6 py-1.5 flex items-center justify-between">
      <div>
        <div className="font-semibold text-lg">{Username}</div>
        {/* <div className="text-sm text-green-500">Online</div> */}
          <div className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      <button className="bg-blue-500 text-white px-4 py-1 rounded">Call</button>
    </div>
  );
};

export default ChatHeader;
