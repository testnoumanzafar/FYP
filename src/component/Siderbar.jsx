import React, { useState, useEffect } from 'react'
import socket from '../constant/utils';
import { CiChat1 } from 'react-icons/ci';
import { FaComments, FaSearch, FaBell, FaCog, FaRegUser } from 'react-icons/fa';
import { MdGroups2 } from 'react-icons/md';
import Profile from './Profile';
const Siderbar = ({setMode}) => {
  // console.log(setMode, "setmode in sidebar")
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('dm'); // 'dm' or 'group'
  const [hasUnreadDMs, setHasUnreadDMs] = useState(false);
  const [hasUnreadGroups, setHasUnreadGroups] = useState(false);

  useEffect(() => {
    // When a DM message arrives and user is NOT in DMs
    socket.on('moveUserToTop', () => {
      if (activeTab !== 'dm') setHasUnreadDMs(true);
    });
    // When a group message arrives and user is NOT in Groups
    socket.on('moveGroupToTop', () => {
      if (activeTab !== 'group') setHasUnreadGroups(true);
    });
    return () => {
      socket.off('moveUserToTop');
      socket.off('moveGroupToTop');
    };
  }, [activeTab]);

  const handleDMClick = () => {
    setActiveTab('dm');
    setMode('dm');
    setHasUnreadDMs(false);
  };
  const handleGroupClick = () => {
    setActiveTab('group');
    setMode('group');
    setHasUnreadGroups(false);
  };
  return (
    <div className="w-[90px] text-black border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
      <div className='space-y-1.5 flex flex-col items-center justify-center mt-2 not-first:'>
        <FaComments className="text-2xl cursor-pointer" />
        <p>Workspace</p>
      </div>
      <div className='space-y-1.5 flex flex-col items-center justify-center cursor-pointer relative' onClick={handleDMClick}>
        <div className="relative">
          <CiChat1 className="text-2xl cursor-pointer" />
          {hasUnreadDMs && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
          )}
        </div>
        <p>DMs</p>
      </div>
      <div className='cursor-pointer space-y-1.5 flex flex-col items-center justify-center relative' onClick={handleGroupClick}>
        <div className="relative">
          <MdGroups2 className="text-2xl cursor-pointer" />
          {hasUnreadGroups && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
          )}
        </div>
        <p>Group</p>
      </div>
      <div className='space-y-1.5 flex flex-col items-center justify-center' onClick={() => setShowProfile(true)}>
        <FaRegUser className="text-xl cursor-pointer" />
        <p>profile</p>
      </div>
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </div>
  );
}
// export default Siderbar;

export default Siderbar