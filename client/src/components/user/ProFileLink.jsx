import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

// 1. Define styles as a JavaScript object
const styles = {
  profileLink: {
    padding:"0",
    margin:"2px",
    display: "inline-block",
    borderRadius: "50%",
    overflow: "hidden",
  
    width:"50px",
    height:"50px"
  },
  avatar: {
    width:"100%",
    height:"100%",
    objectFit: "cover",
    display: "block"
  }
};

function ProFileLink() {
  const { auth } = useAuth();
  console.log(auth)
  return (
    // 2. Pass the object directly to the style attribute
    <Link to={`/profile/${auth?.userId}`} style={styles.profileLink} title="Your Profile">      
      <img src={auth?.avatarUrl  || 'https://placehold.co/150'} width={100}  style={styles.avatar} alt="Profile" />
    </Link>
  );
}

export default ProFileLink;