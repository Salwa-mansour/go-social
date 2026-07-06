import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import '../../css/list.css';

export default function PendingRequests() {
  const axiosPrivate = useAxiosPrivate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // Tracks loading per button

  useEffect(() => {
    let isMounted = true;
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/user/requests');
        if (isMounted) setRequests(response.data);
      } catch (err) {
        if (isMounted) setError("Failed to load follow requests.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRequests();
    return () => { isMounted = false; };
  }, [axiosPrivate]);

  const handleAction = async (requestId, action) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      if (action === 'accept') {
        await axiosPrivate.patch(`/user/requests/accept/${requestId}`);
      } else {
        await axiosPrivate.delete(`/user/requests/reject/${requestId}`);
      }
      
      // Filter out the request locally so it disappears from the UI immediately
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      alert(`Could not process request ${action}.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="requests-container">
      <h3>Follow Requests ({requests.length})</h3>
      {requests.length === 0 ? (
        <p>No pending follow requests.</p>
      ) : (
        <ul className="requests-list">
          {requests.map((req) => (
            <li key={req.id} className="request-card">
      
              <Link to={`/user/${req.sender.id}`} className="user-card-link">
                  <figure  className="request-avatar" >
                    <img 
                      src={req.sender.avatarUrl || 'https://placehold.co/50'} 
                      alt={req.sender.name} 
                      
                    />
                  </figure>
                  <span>@{req.sender.name} wants to follow you</span>
             </Link>
              
              <div className="request-actions">
                <button 
                  className="accept-btn"
                  onClick={() => handleAction(req.id, 'accept')}
                  disabled={actionLoading[req.id]}
                >
                  {actionLoading[req.id] ? '...' : 'Accept'}
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleAction(req.id, 'reject')}
                  disabled={actionLoading[req.id]}
                >
                  {actionLoading[req.id] ? '...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}