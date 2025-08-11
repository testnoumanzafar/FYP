
import React, { useState } from 'react';
import { useUsers } from '../context/UserContext';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { URL } from '../constant/utils';

const GroupPopup = ({ onClose }) => {
  const { users } = useUsers();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleImageChange = (e) => {
    setGroupImage(e.target.files[0]);
  };

const handleCreateGroup = async () => {
  const formData = new FormData();
  formData.append('name', groupName);
  formData.append('adminId', localStorage.getItem('Cuserid')); // ✅ REQUIRED!
  formData.append('memberIds', JSON.stringify(selectedUsers)); // ✅ must be 'memberIds'
  if (groupImage) formData.append('groupImage', groupImage);

  try {
    const res = await axios.post(`${URL}/api/groups/create`, formData);
    console.log('Group created:', res.data);
    onClose();
  } catch (error) {
    console.error('Error creating group:', error.response?.data || error.message);
  }
};




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40">
      <div className="bg-white w-[500px] rounded-xl shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <IoClose size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Group</h2>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          className="w-full border rounded-md px-3 py-2 mb-4"
        />

        {/* <input type="file" onChange={handleImageChange} className="mb-4" /> */}
        <input
  type="file"
  name="groupImage" // optional but matches multer
  onChange={handleImageChange}
  className="mb-4"
/>


        <p className="font-medium mb-2">Select members:</p>
        <div className="max-h-60 overflow-y-auto pr-1">
          {users.map((user) => (
            <label
              key={user._id}
              className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-100 rounded"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleCheckboxChange(user._id)}
              />
              <img src={user.picture.url} alt="" className="w-8 h-8 rounded-full" />
              <span>{user.name}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-1 rounded">
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPopup;
