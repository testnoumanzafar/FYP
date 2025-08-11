 
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Signup from './component/Signup'
import { Toaster } from 'react-hot-toast'
import Login from './component/Login'
import ChatMain from './page/ChatMain'
import Chatgroup from './component/Chatgroup'
import PrivateRoute from './component/PrivateRoute'

function App() {

  return (
    <>
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

        {/* <Route path="/chat" element={<ChatMain />} />
        <Route path="/chat/:id" element={<ChatMain />} /> */}
        
      </Routes>
    </BrowserRouter>
   
    <Toaster />
    </>
  )
}

export default App
