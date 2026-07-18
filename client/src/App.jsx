import { Routes, Route } from "react-router-dom";
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
import FormLayout from './components/FormLayout'; // 💡 Fixed spelling

function App() {
  return (
    <Routes>
      {/* 1. Auth & Public Forms Layout */}
      <Route element={<FormLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="oauth-callback" element={<OAuthCallback />} />
      </Route>

      {/* 2. Global Auth Wrapper State Layers */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}> 
          
          {/* 💡 NOW INSIDE: Main App Shell Layout mounts only after auth passes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="editProfile" element={<EditProfile/>}/>
            <Route path="allUsers" element={<UsersList/>} />
            <Route path="pendingRequests" element={<PendingRequests/>} />
            <Route path="profile/:userId" element={<UserProfile/>} />
            <Route path="post/:postId" element={<PostDetails/>} />
            <Route path="post/edit/:postId" element={<EditPost/>} />
          </Route>

        </Route>
      </Route> 

      {/* Fallbacks & Redirects */}
      <Route path="*" element={<Missing/>} />
    </Routes>
  );
}
export default App;