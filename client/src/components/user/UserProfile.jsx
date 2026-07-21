import { useState, useEffect } from 'react';
import { useParams ,Link} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useAuth } from '../../hooks/useAuth';
import PostList from "../post/List";
import FollowButton from './FollowButton'; 

function UserProfile() {
  const { userId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const {auth} = useAuth();
  
  const [authorData, setAuthorData] = useState({});
  const [authorPosts, setAuthorPosts] = useState([]); 
  const [loadingData, setLoadingData] = useState(true); 
  const [loadingError, setLoadingError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoadingError("");
        setLoadingData(true);
        const response = await axiosPrivate.get(`/user/authordata/${userId}`, {
          signal: controller.signal
        });
        
        if (isMounted) {
          setAuthorData(response.data.user || {});
          setAuthorPosts(response.data.posts || []);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && isMounted) {
          console.error(err);
          setLoadingError("Failed to fetch profile details");
        }
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    };

    fetchData(); 

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, userId]); 

  // 🚀 Step 1: Centralized state updater to catch relationship toggles from the button
  const handleProfileFollowStateUpdate = (targetUserId, relationshipStatusObj) => {
    setAuthorData(prevData => ({
      ...prevData,
      ...relationshipStatusObj // Merges { isFollowing: true/false, isPending: true/false }
    }));
  };

  if (loadingData) {
    return <p>Loading profile...</p>;
  }
  
  if (loadingError) {
    return <p style={{ color: 'red' }}>{loadingError}</p>;
  }

  return (
    <>
      {/* 👤 Profile Header Card Layout */}
      <header className="top-container" style={{  textAlign: "center" }}>
        <figure className="user-data">
          <div className="profile-image" >
            <img 
              src={authorData?.avatarUrl || 'https://placehold.co/150'} 
              alt={`${authorData?.name || 'User'}'s avatar`} 
              width="150"
              style={{ borderRadius: "50%", marginBottom: "10px" }}
            />
          </div>  
        <figcaption>@{authorData?.name || "anonymous"}</figcaption>
       </figure>
        {authorData?.bio && <p className="profile-bio">{authorData.bio}</p>}

        { authorData.id === auth?.userId && 
          <div>
          <Link to="/editprofile" title="Edit Profile">
               Edit Profile
          </Link>
          </div> }
        {/* 🚀 Step 2: Inject the FollowButton right into the profile header header */}
        <div className="profile-relationship-container" style={{ marginTop: "15px" }}>
          <FollowButton 
            user={authorData} // Passes down the authorData user payload object
            onStateUpdate={handleProfileFollowStateUpdate} // Wired back to our modifier function
          />
        </div>
      </header>

     

      {/* 📝 User's Profile Timeline Feed */}
      <section className="main-content">
        {/* <h3>Posts by @{authorData?.name || "User"}</h3>
         */}
        <PostList 
          posts={authorPosts} 
          setPosts={setAuthorPosts} 
          pageOwnerId={userId}
        />
      </section>
    </>
  );
}

export default UserProfile;