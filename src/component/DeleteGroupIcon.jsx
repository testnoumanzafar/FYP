// components/DeleteGroupIcon.jsx
import React, { useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { URL } from "../constant/utils";
// import { URL } from "../constant/utils";

const DeleteGroupIcon = ({ groupId, groupName, onDelete }) => {
  const senderEmail = localStorage.getItem("Cuseremail");
  const senderId = localStorage.getItem("Cuserid");
 const menuRef = useRef();

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [showMenu, setShowMenu] = useState(false);

  if (senderEmail !== "nouman@gmail.com") return null;

  const handleDelete = async () => {
    try {
      await axios.delete(`${URL}/api/groups/delete`, {
        data: {
          groupId,
          adminId: senderId,
        },
      });
       setShowMenu(false); 
      if (onDelete) onDelete(groupId);
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <FiMoreVertical
        className="cursor-pointer text-gray-500 hover:text-black"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
      />
      {showMenu && (
        <div className="absolute right-0 bg-white border rounded shadow p-2 z-50">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="flex items-center gap-2 text-red-500 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
          >
            <FiTrash2 /> Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteGroupIcon;
