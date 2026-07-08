import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function FollowButton({ user, onStateUpdate }) {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async (isCurrentlyFollowing) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isCurrentlyFollowing) {
        await axiosPrivate.delete(`/user/unfollow/${user.id}`);
        onStateUpdate(user.id, { isFollowing: false, isPending: false });
      } else {
        await axiosPrivate.post(`/user/follow/${user.id}`);
        onStateUpdate(user.id, { isFollowing: false, isPending: true });
      }
    } catch (err) {
      console.error("Failed to change follow status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="follow-action-container">
      {user.isFollowing ? (
        <button className="follow-btn following" onClick={() => handleFollowToggle(true)} disabled={isLoading}>
          {isLoading ? '...' : 'Unfollow'}
        </button>
      ) : user.isPending ? (
        <div className="pending-actions-group">
          <button className="follow-btn pending" disabled={true}>Requested</button>
          <button className="follow-btn undo" onClick={() => handleFollowToggle(true)} disabled={isLoading}>
            {isLoading ? '...' : 'Undo'}
          </button>
        </div>
      ) : (
        <button className="follow-btn" onClick={() => handleFollowToggle(false)} disabled={isLoading}>
          {isLoading ? '...' : 'Follow'}
        </button>
      )}
    </div>
  );
}

export default FollowButton;