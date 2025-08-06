 
import Chatlist from '../component/Chatlist'
import ChatWindow from '../component/ChatWindow'
import Sidebar from "../component/Siderbar"
 
import ShowDefault from '../component/ShowDefault'

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chatgroup from '../component/Chatgroup';
import socket from '../constant/utils';

const ChatMain = () => {
  // const { id } = useParams(); // id from URL like /chat/abc123
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
const [mode, setMode] = useState("dm");
console.log(mode, "chatmain")


//  now 7/27/2025 

useEffect(() => {
  const userId = localStorage.getItem("Cuserid"); // you already store it
  if (userId) {
    socket.emit("userOnline", userId);
  }
}, []);

const { id } = useParams(); // id could be "user-123" or "group-456"

const extractModeAndId = (rawId) => {
  if (!rawId) return { type: null, actualId: null };
  const [type, actualId] = rawId.split("-");
  return { type, actualId };
};

const { type, actualId } = extractModeAndId(id);
useEffect(() => {
  if (type === "group") setMode("group");
  else if (type === "user") setMode("dm");
}, [type]);

 
  // now 7/27/2025 
const handleUserSelect = (user) => {
  setSelectedUser(user);
  setMode("dm");
  navigate(`/chat/user-${user._id}`);
};

const handleGroupSelect = (group) => {
  setSelectedGroup(group);
  setMode("group");
  navigate(`/chat/group-${group._id}`);
};



  return (
    <div className="h-screen flex">
      <div className="overflow-y-auto flex">
        <Sidebar setMode={setMode} />
        <Chatlist mode={mode} onUserSelect={handleUserSelect} user={selectedUser}  onGroupSelect={handleGroupSelect}/>
        
      </div>

      <div className="flex-1">
     

    

  {type === "group" ? (
    actualId ? <Chatgroup groupId={actualId} /> : <ShowDefault />
  ) : type === "user" ? (
    actualId ? <ChatWindow userId={actualId} user={selectedUser} /> : <ShowDefault />
  ) : (
    <ShowDefault />
  )}



      </div>
    </div>
  );
};


// module.exports = ChatMain;
export default ChatMain;