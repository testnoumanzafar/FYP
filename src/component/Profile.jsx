import { useEffect, useState } from "react";
import { URL } from "../constant/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Profile.js
const Profile = ({ onClose }) => {


const [profile, setProfile] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
   const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("Cusertoken"); // or context/sessionStorage/etc.

    const response = await axios.get(`${URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User Profile:", response);
       setProfile(response.data); 
    console.log(" Profile:", response.data);
  } catch (error) {
    console.log(error);
    
    console.error("Error fetching profile:", error.response?.data || error.message);
    
  }}
  getUserProfile()
  }, []);

  const handlelogout = async () => {

    localStorage.removeItem("Cusertoken");
    localStorage.removeItem("Cuserid");  

    localStorage.removeItem("Cusername");  
localStorage.removeItem("Cuseremail");
    localStorage.removeItem("currentlyChattingGroup");  
    localStorage.removeItem("currentlyChattingWith");  
    localStorage.removeItem("epr_suggested");  
 localStorage.removeItem("currentChatPartnerName");
 localStorage.removeItem("nameOw");
    navigate('/login')

  }

  return (
  
 
   <>
  <div className="fixed inset-0  bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[380px] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-3 text-gray-500 text-xl hover:text-gray-700"
        >
          &times;
        </button>

        {!profile ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          <>
            <div className="relative flex justify-center">
              <img
                src={profile.user.picture?.url || "/default-profile.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-md"
              />
              
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {profile.user.name}
              </h2>
            </div>

            <hr className="my-4 border-gray-200" />

            <div className="space-y-3">
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <span className="text-purple-500 text-xl mr-3">👤</span>
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {profile.user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <span className="text-purple-500 text-xl mr-3">📧</span>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-medium text-gray-800">
                    {profile.user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {/* <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                ⚙️ Edit Profile
              </button> */}
              <button  onClick={handlelogout} className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                ↩️ Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </>
  );
};

export default Profile;
