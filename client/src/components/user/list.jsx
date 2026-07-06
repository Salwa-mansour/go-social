import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import '../../css/list.css';
import { Link } from 'react-router-dom';

export default function UsersList() {
  const axiosPrivate = useAxiosPrivate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track button-specific loading states using user IDs
  const [followLoadingStates, setFollowLoadingStates] = useState({});

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
  setFollowLoadingStates(prev => ({ ...prev, [targetUserId]: true }));

  try {
    if (isCurrentlyFollowing) {
      // Deletes the row completely (Works for both active follow and undoing a request!)
      await axiosPrivate.delete(`/user/unfollow/${targetUserId}`);
      
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === targetUserId ? { ...u, isFollowing: false, isPending: false } : u)
      );
    } else {
      // Creates a new PENDING request row
      await axiosPrivate.post(`/user/follow/${targetUserId}`);
      
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === targetUserId ? { ...u, isFollowing: false, isPending: true } : u)
      );
    }
  } catch (err) {
    console.error("Failed to alter follow state:", err);
  } finally {
    setFollowLoadingStates(prev => ({ ...prev, [targetUserId]: false }));
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
            const isBtnLoading = followLoadingStates[user.id];
            
            return (
              <li key={user.id} className="user-card">
                 <Link to={`/user/${user.id}`} className="user-card-link">
                    <figure className="user-avatar">
                      <img 
                        src={user.avatarUrl || 'https://placehold.co/150'} 
                        alt={`${user.username}'s avatar`} 
                        
                      />
                    </figure>
                    
                    <div className="user-card-info">
                      <h4>@{user.username}</h4>
                      <p className="user-bio">{user.bio || "No bio written yet."}</p>
                    </div>
                  </Link>
                    <div className="user-card-actions">
                        
                        {user.isFollowing ? (
                          /* State 1: Active Follower */
                          <button 
                            className="follow-btn following"
                            onClick={() => handleFollowToggle(user.id, true)}
                            disabled={followLoadingStates[user.id]}
                          >
                            {followLoadingStates[user.id] ? '...' : 'Unfollow'}
                          </button>
                        ) : user.isPending ? (
                          /* State 2: Request is Pending Approval */
                        <div className="pending-actions-group">
                              <button className="follow-btn pending" disabled={true}>
                                Requested
                              </button>
                              <button 
                                className="follow-btn undo"
                                onClick={() => handleFollowToggle(user.id, true)}
                                disabled={followLoadingStates[user.id]}
                              >
                                {followLoadingStates[user.id] ? '...' : 'Undo'}
                              </button>
                      </div>
                        ) : (
                          /* State 3: No Relationship Active */
                          <button 
                            className="follow-btn"
                            onClick={() => handleFollowToggle(user.id, false)}
                            disabled={followLoadingStates[user.id]}
                          >
                            {followLoadingStates[user.id] ? '...' : 'Follow'}
                          </button>
                        )}
                      </div>
                  
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}