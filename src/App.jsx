 
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Signup from './component/Signup'
import { Toaster } from 'react-hot-toast'
import Login from './component/Login'
import ChatMain from './page/ChatMain'
import Chatgroup from './component/Chatgroup'
import PrivateRoute from './component/PrivateRoute'
import GlobalVideoCallNotification from './component/GlobalVideoCallNotification'
import { VideoCallProvider } from './context/VideoCallContext'
// import { VideoCallProvider } from './context/VideoCallContext'

function App() {
  return (
    <>
      <VideoCallProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatMain />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <PrivateRoute>
                  <ChatMain />
                </PrivateRoute>
              }
            />
          </Routes>
          <GlobalVideoCallNotification />
        </BrowserRouter>
      </VideoCallProvider>
      <Toaster />
    </>
  )
  // )
}

export default App
