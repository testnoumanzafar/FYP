import React, { useEffect, useState } from "react";
 
import axios from "axios";
import socket, { mockGroups, URL } from "../constant/utils";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { FiPlus } from "react-icons/fi";
import GroupPopup from "./GroupPopup";
import DeleteGroupIcon from "./DeleteGroupIcon";
import DeleteUserIcon from "./DeleteUserIcon";
 

const Chatlist = ({ mode, onUserSelect, onGroupSelect }) => {
  const { onlineStatus } = useUsers();
  const { users, setUsers } = useUsers();
  const navigate = useNavigate();
  
  // State declarations
  const [search, setSearch] = useState("");
  const [usersGroup, setUsersGroup] = useState([]);
  const [newMessageGroups, setNewMessageGroups] = useState([]);
  const [newMessageUserIds, setNewMessageUserIds] = useState([]);
  const senderId = localStorage.getItem("Cuserid");
// console.log(mode, "chatlist")
 const [showPopup, setShowPopup] = useState(false);
  //  for group chat 
//  const senderId = localStorage.getItem("Cuserid");
  const senderEmail = localStorage.getItem("Cuseremail");  
  const isAdmin = senderEmail === "nouman@gmail.com"; 


  // Fetch user's groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userId = localStorage.getItem('Cuserid');
        const res = await axios.get(`${URL}/api/groups/user/${userId}`);
        console.log('User Groups:', res.data);
        setUsersGroup(res.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);
 


 // Handle direct messages and group messages
 useEffect(() => {
    // Direct message handler
    const handleDirectMessage = (message) => {
      const sender = message.senderId;
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex((u) => u._id === sender);
        if (userIndex === -1) return prevUsers;

        const updated = [...prevUsers];
        const [user] = updated.splice(userIndex, 1);
        return [user, ...updated];
      });

      const currentlyOpenUserId = localStorage.getItem("currentlyChattingWith");
      if (currentlyOpenUserId !== sender) {
        setNewMessageUserIds((prev) =>
          prev.includes(sender) ? prev : [...prev, sender]
        );
      }
    };

    // Group message handler
    const handleGroupMessage = (data) => {
      console.log("Group message received:", data);
      const groupId = data.groupId;
      
      // Move group to top
      setUsersGroup(prevGroups => {
        const groupToMove = prevGroups.find(g => g._id === groupId);
        if (!groupToMove) return prevGroups;
        
        const otherGroups = prevGroups.filter(g => g._id !== groupId);
        return [groupToMove, ...otherGroups];
      });

      // Add unread indicator if not in the group
      const currentlyOpenGroupId = localStorage.getItem("currentlyChattingGroup");
      if (currentlyOpenGroupId !== groupId) {
        setNewMessageGroups(prev => 
          prev.includes(groupId) ? prev : [...prev, groupId]
        );
      }
    };

    // Group move to top handler (when someone else sends a message)
    const handleGroupMoveToTop = ({ groupId }) => {
      console.log("Moving group to top:", groupId);
      setUsersGroup(prevGroups => {
        const groupToMove = prevGroups.find(g => g._id === groupId);
        if (!groupToMove) return prevGroups;
        
        const otherGroups = prevGroups.filter(g => g._id !== groupId);
        return [groupToMove, ...otherGroups];
      });

      // Add unread indicator if not in the group
      const currentlyOpenGroupId = localStorage.getItem("currentlyChattingGroup");
      if (currentlyOpenGroupId !== groupId) {
        setNewMessageGroups(prev => 
          prev.includes(groupId) ? prev : [...prev, groupId]
        );
      }
    };

    // Set up all event listeners
    socket.on("receiveMessage", handleDirectMessage);
    socket.on("moveUserToTop", ({ userId }) => handleDirectMessage({ senderId: userId }));
    socket.on("receiveGroupMessage", handleGroupMessage);
    socket.on("moveGroupToTop", handleGroupMoveToTop);

    // Cleanup all listeners
    return () => {
      socket.off("receiveMessage");
      socket.off("moveUserToTop");
      socket.off("receiveGroupMessage");
      socket.off("moveGroupToTop");
    };
}, []);



  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  // const isOnline = onlineStatus[user._id] === "online";
  );
console.log(filteredUsers,"filter");


  // Handler to clear notification when user/group is opened
  const handleUserSelect = (user) => {
    onUserSelect(user);
    localStorage.setItem("Cusername", user.name);
    localStorage.setItem("currentlyChattingWith", user._id);
    setNewMessageUserIds((prev) => prev.filter((id) => id !== user._id));
  };

  const handleGroupSelect = (group) => {
    onGroupSelect(group);
    localStorage.setItem("Cusername", group.name);
    localStorage.setItem("currentlyChattingGroup", group._id);
    setNewMessageGroups((prev) => prev.filter((id) => id !== group._id));
  };

  return (
    <div className="w-96 border-r border-gray-200 h-full overflow-y-auto overflow-x-hidden hide-scrollbar">
      {mode === "group" ? (
        <>
          <div className="flex justify-between items-center px-4 py-2 mt-1.5">
            <div className="font-medium text-lg">Groups</div>
            {isAdmin && (
              <div
                className="flex gap-2 justify-center items-center font-medium text-lg bg-green-400 px-2 py-1 rounded-lg cursor-pointer hover:bg-green-500"
                onClick={() => setShowPopup(true)}
              >
                <FiPlus /> Create
              </div>
            )}
          </div>

          {showPopup && <GroupPopup onClose={() => setShowPopup(false)} />}

          <div className="sticky top-0 bg-white w-full pt-4 px-4">
            <h2 className="text-lg font-medium font-sans mb-4">
              Active Conversation{" "}
              <span className="bg-gray-300 px-2 text-sm rounded-md ml-2">
                {usersGroup.length}
              </span>
            </h2>
            <input
              type="text"
              placeholder="Search"
              value={search}
  onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 mb-4 rounded border border-gray-300 bg-gray-100"
            />
          </div>

          <ul className="space-y-4 p-4">
            {usersGroup.filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase())
    ).map((user, idx) => (
              <li
                key={idx}
                onClick={() => handleGroupSelect(user)}
                className="cursor-pointer"
              >
                <div className="flex space-x-4 hover:bg-gray-100 p-1 rounded-lg transition duration-200 ease-in-out">
                  <div className="relative">
                    <img
                      src={user.picture}
                      alt="user pic"
                      className="w-14 h-14 rounded-full"
                    />
                    {newMessageGroups.includes(user._id) && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium">{user.name}</div>
                    <DeleteGroupIcon
                      groupId={user._id}
                      groupName={user.name}
                      onDelete={(deletedId) =>
                        setUsersGroup((prev) => prev.filter((g) => g._id !== deletedId))
                      }
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="w-96 border-r border-gray-200 h-full overflow-y-auto overflow-x-hidden hide-scrollbar relative z-0">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white w-full pt-4 px-4 z-10">
              <h2 className="text-lg font-medium font-sans mb-4">
                Active Conversation{" "}
                <span className="bg-gray-300 px-2 text-sm rounded-md ml-2">
                  {filteredUsers.length}
                </span>
              </h2>
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                type="text"
                placeholder="Search"
                className="w-full px-3 py-1.5 mb-4 rounded border border-gray-300 bg-gray-100"
              />
            </div>

            {/* List */}
            <ul className="space-y-4 p-4">
              {users.map((user, idx) => (
                <li
                  key={idx}
                  onClick={() => handleUserSelect(user)}
                  className="cursor-pointer"
                >
                  <div className="flex space-x-4 hover:bg-gray-100 p-1 rounded-lg transition duration-200 ease-in-out">
                    <div className="relative w-14 h-14">
                      <img
                        src={user.picture.url}
                        alt="user pic"
                        className="w-14 h-14 rounded-full"
                      />
                      {onlineStatus[user._id] === "online" && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                      {newMessageUserIds.includes(user._id) && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="font-medium">{user.name}</div>
                      <DeleteUserIcon userId={user._id} userName={user.name} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
export default Chatlist;


