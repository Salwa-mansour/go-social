import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom'; // 💡 Import useOutletContext instead
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import '../../css/list.css';

export default function PendingRequests() {
  const axiosPrivate = useAxiosPrivate();
  
  // 💡 Pull layout data down seamlessly here
  const { requests, setRequests } = useOutletContext();
  
  const [actionLoading, setActionLoading] = useState({}); 

  const handleAction = async (requestId, action) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      if (action === 'accept') {
        await axiosPrivate.patch(`/user/requests/accept/${requestId}`);
      } else {
        await axiosPrivate.delete(`/user/requests/reject/${requestId}`);
      }
      
      // 💡 This updates the Layout state, instantly dropping the count in the Nav bar!
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      alert(`Could not process request ${action}.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  // Note: layout handles initial fetching states, so we don't need "loading" or "error" flags here.
  return (
    <div className="main-content">
      <div className="top-container">
         <h3>Follow Requests ({requests.length})</h3>
      </div>
     
      {requests.length === 0 ? (
        <p>No pending follow requests.</p>
      ) : (
        <ul className=" glass-container requests-list">
          {requests.map((req) => (
            <li key={req.id} className="request-item">
      
              <Link to={`/profile/${req.sender?.id}`} >
                  <figure className="user-avatar" >
                      <div className="image">
                          <img 
                            src={req.sender?.avatarUrl || 'https://placehold.co/50'} 
                            alt={req.sender?.name || 'User'} 
                          />
                      </div>
                     <figcaption><strong>@{req.sender?.name || 'User'}</strong> wants to follow you</figcaption>
                  </figure>
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