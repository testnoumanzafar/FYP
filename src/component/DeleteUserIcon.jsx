
import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash } from "react-icons/fi";
import axios from "axios";
import { URL } from "../constant/utils";
import { useUsers } from "../context/UserContext";

const DeleteUserIcon = ({ userId, userName }) => {
  const { setUsers } = useUsers();
  const loggedInEmail = localStorage.getItem("Cuseremail");
  const [showMenu, setShowMenu] = useState(false);
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

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false); // hide menu immediately

    try {
      await axios.delete(`${URL}/user/delete/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete user.");
    }
  };

  // Only show for admin
  if (loggedInEmail !== "nouman@gmail.com") return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Three-dot icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((prev) => !prev);
        }}
        className="p-1 rounded hover:bg-gray-200"
      >
        <FiMoreVertical />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-24 bg-white shadow-md rounded z-50">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-100 w-full"
          >
            <FiTrash /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteUserIcon;
