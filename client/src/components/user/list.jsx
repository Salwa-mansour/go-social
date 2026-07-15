import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';
import '../../css/list.css';

export default function UsersList() {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 🚀 Simple centralized state modifier handler mapping callback
  const handleUserFieldsUpdate = (targetUserId, targetPropertiesObj) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === targetUserId ? { ...u, ...targetPropertiesObj } : u)
    );
  };

  if (loading) return <div className="loading">Loading community profiles...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="main-content">
      <div className="top-container">
            <h2 style={{textAlign:'center'}}>Discover Creators</h2>
      </div>
    
      {users.length === 0 ? (
        <p>No other users found yet.</p>
      ) : (
        <ul className="glass-container users-list" >
          {users.map((user) => (
            <li key={user.id} className="user-item">

              
              <Link to={`/profile/${user.id}`} className="user-link">
                <figure className="user-avatar">
                  <div className='image'>
                     <img 
                    src={user.avatarUrl || 'https://placehold.co/150'} 
                    alt={`${user.username}'s avatar`} 
                    />
                  </div>
                 
                  <figcaption>@{user.username}</figcaption>
                </figure>
                
          
              </Link>

        
              <FollowButton 
                user={user} 
                onStateUpdate={handleUserFieldsUpdate} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}