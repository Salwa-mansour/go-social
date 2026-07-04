import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export default function UsersList() {
  const axiosPrivate = useAxiosPrivate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track button-specific loading states using user IDs
  const [followingStates, setFollowingStates] = useState({});

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosPrivate.get('/user/allusers', {
          signal: controller.signal
        });
        
        if (isMounted) {
          // Fallback to response.data.users if your backend wraps it
          const data = response.data.users || response.data;
          setUsers(data);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && isMounted) {
          console.error("Failed to fetch users:", err);
          setError("Could not load users. Please try again later.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  // Handle following/unfollowing action logic
const handleFollowToggle = async (targetUserId, isCurrentlyFollowing) => {
  setFollowingStates(prev => ({ ...prev, [targetUserId]: true }));

  try {
    if (isCurrentlyFollowing) {
      await axiosPrivate.delete(`/user/unfollow/${targetUserId}`);
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === targetUserId ? { ...u, isFollowing: false, isPending: false } : u)
      );
    } else {
      await axiosPrivate.post(`/user/follow/${targetUserId}`);
      // Assuming your follow system defaults to instant ACCEPTED:
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === targetUserId ? { ...u, isFollowing: true, isPending: false } : u)
      );
      
      // NOTE: If you change your system to require approval later, 
      // change the line above to: isFollowing: false, isPending: true
    }
  } catch (err) {
    console.error("Failed to alter follow state:", err);
  } finally {
    setFollowingStates(prev => ({ ...prev, [targetUserId]: false }));
  }
};
  if (loading) return <div className="loading">Loading community profiles...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="users-container">
      <h2>Discover Creators</h2>
      
      {users.length === 0 ? (
        <p>No other users found yet.</p>
      ) : (
        <ul className="users-grid">
          {users.map((user) => {
            const isBtnLoading = followingStates[user.id];
            
            return (
              <li key={user.id} className="user-card">
                <img 
                  src={user.avatarUrl || 'https://placehold.co/150'} 
                  alt={`${user.username}'s avatar`} 
                  className="user-card-avatar"
                />
                <div className="user-card-info">
                  <h4>@{user.username}</h4>
                  <p className="user-bio">{user.bio || "No bio written yet."}</p>
                  
                <div className="user-card-actions">
                    <button className="view-profile-btn">View Portfolio</button>
                    
                    {user.isFollowing ? (
                      /* State 1: Active Follower */
                      <button 
                        className="follow-btn following"
                        onClick={() => handleFollowToggle(user.id, true)}
                        disabled={followingStates[user.id]}
                      >
                        {followingStates[user.id] ? '...' : 'Unfollow'}
                      </button>
                    ) : user.isPending ? (
                      /* State 2: Request is Pending Approval */
                      <button 
                        className="follow-btn pending" 
                        disabled={true} // Locks the button so they can't resend requests
                      >
                        Requested
                      </button>
                    ) : (
                      /* State 3: No Relationship Active */
                      <button 
                        className="follow-btn"
                        onClick={() => handleFollowToggle(user.id, false)}
                        disabled={followingStates[user.id]}
                      >
                        {followingStates[user.id] ? '...' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}