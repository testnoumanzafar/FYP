import React, { useEffect } from 'react';
import { useVideoCall } from '../context/VideoCallContext';
import { FaVideo, FaPhoneSlash } from 'react-icons/fa';
// import call  from "../assets/notification.mpv3"; 
import call from "../assets/notification.mp3"; // Ensure you have this audio file in your assets

// Ensure you have this audio file in your assets
const GlobalVideoCallNotification = () => {
  const { 
    incomingCall, 
    acceptCall, 
    rejectCall,
  } = useVideoCall();

  useEffect(() => {
    // Play notification sound when there's an incoming call
    if (incomingCall) {
      const audio = new Audio(call); // You'll need to add this audio file
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [incomingCall]);

  if (!incomingCall) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-xl p-6 shadow-2xl w-80">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse">
            <FaVideo className="text-white text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-1">Incoming Video Call</h3>
          <p className="text-gray-600 text-center text-sm">{incomingCall.callerName} is calling you</p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={rejectCall}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
            title="Reject Call"
          >
            <FaPhoneSlash size={18} />
          </button>
          <button
            onClick={acceptCall}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors"
            title="Accept Call"
          >
            <FaVideo size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalVideoCallNotification;
