import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import OAuthCallback from './components/OAuthCallback';
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import Home from "./components/Home";
import Missing from "./components/Missing";
import EditProfile from './components/user/EditProfile';
import UsersList from './components/user/list';
import PendingRequests from './components/user/PendingRequests';
import UserProfile from './components/user/UserProfile';
import PostDetails from './components/post/Details';
import EditPost from './components/post/Edit';

function App() {
 
  return (
    
    <Routes>
       <Route path="login" element={<Login />} />
       <Route path="register" element={<Register />} />
       <Route path="/oauth-callback" element={<OAuthCallback />} />
            
       <Route path="/" element={<Layout />}>
         
         {/* Protected Application Routes */}
          <Route element={<PersistLogin />}>
           <Route element={<RequireAuth />}> 
                 <Route path="/" element={<Home />} />
                 <Route path="editProfile" element={<EditProfile/>}/>
                 <Route path="allUsers" element={<UsersList/>} />
                 <Route path="pendingRequests" element={<PendingRequests/>} />
                 <Route path="profile/:userId" element={<UserProfile/>} />
                 <Route path="post/:postId" element={<PostDetails/>} />
                 <Route path="post/edit/:postId" element={<EditPost/>} />
           </Route>
          </Route> 
        {/* Fallbacks & Redirects */}
       
         <Route path="*" element={<Missing/>} />
       </Route>
    </Routes>

  )
}

export default App
