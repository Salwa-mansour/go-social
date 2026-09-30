import LogoutBtn from "./LogoutBtn";
import ProFileLink from "./user/ProFileLink";
import {Link}  from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus,faUserPen,faBell ,faHouse} from "@fortawesome/free-solid-svg-icons";
import "../css/nav.css";

const style={
  requestItem:{
    position: 'relative'
  },
  requestCount:{
     position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#ff4747',
    fontSize: '.75rem',
    lineHeight: '20px',
    textAlign: 'center',
    left: '50%',
    top: '10%',
  }
}

const Nav = ({requestCount}) => {
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
          <Link to="/pendingRequests" title="Requests" style={style.requestItem} >
            <span style={style.requestCount}>{requestCount}</span>
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