import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import PostList from "../post/List";
import FollowButton from './FollowButton'; // 🚀 Imported perfectly

function UserProfile() {
  const { userId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  
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
    <div className="user-profile-page">
      {/* 👤 Profile Header Card Layout */}
      <header className="profile-header" style={{ padding: "20px", textAlign: "center" }}>
        <img 
          src={authorData?.avatarUrl || 'https://placehold.co/150'} 
          alt={`${authorData?.name || 'User'}'s avatar`} 
          width="150"
          style={{ borderRadius: "50%", marginBottom: "10px" }}
        />
        <h2>@{authorData?.name || "anonymous"}</h2>
        {authorData?.bio && <p className="profile-bio">{authorData.bio}</p>}

        {/* 🚀 Step 2: Inject the FollowButton right into the profile header header */}
        <div className="profile-relationship-container" style={{ marginTop: "15px" }}>
          <FollowButton 
            user={authorData} // Passes down the authorData user payload object
            onStateUpdate={handleProfileFollowStateUpdate} // Wired back to our modifier function
          />
        </div>
      </header>

      <hr />

      {/* 📝 User's Profile Timeline Feed */}
      <section className="profile-feed">
        <h3>Posts by @{authorData?.name || "User"}</h3>
        
        <PostList 
          posts={authorPosts} 
          setPosts={setAuthorPosts} 
        />
      </section>
    </div>
  );
}

export default UserProfile;