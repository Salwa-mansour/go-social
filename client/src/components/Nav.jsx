import LogoutBtn from "./LogoutBtn";
import {Link}  from "react-router-dom";
import "../css/nav.css";

const Nav = () => {
  return (
    <nav className="navbar">    
       <ul className="nav-links">
        <li>
          <Link to="/editprofile">Edit Profile</Link>
        </li>
        <li>
          <Link to="/allUsers">Discover</Link>
        </li>
        <li>
          <Link to="/pendingRequests">Requests</Link>
        </li>
        <li>
          <LogoutBtn />
        </li>
       </ul>
    </nav>
  )
}

export default Nav