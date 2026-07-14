import LogoutBtn from "./LogoutBtn";
import ProFileLink from "./user/ProFileLink";
import {Link}  from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus,faUserPen,faBell ,faHouse} from "@fortawesome/free-solid-svg-icons";
import "../css/nav.css";

const Nav = () => {
  return (
    <nav className="navbar glass-container">    
       <ul className="nav-links">
        <li>
            <ProFileLink/>
        </li>
      
        <li>
          <Link to="/" title="feed">
                <FontAwesomeIcon icon={faHouse} />
          </Link>
        </li>
     
        <li>
          <Link to="/allUsers" title="Discover">
              <FontAwesomeIcon icon={faUserPlus} />
          </Link>
        </li>
        <li>
          <Link to="/pendingRequests" title="Requests">
                <FontAwesomeIcon icon={faBell} />
          </Link>
        </li>
        <li>
          <LogoutBtn />
        </li>
       </ul>
    </nav>
  )
}

export default Nav