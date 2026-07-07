import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";

function PostActions({ post, onLikeUpdate }) {
  const axiosPrivate = useAxiosPrivate();
  const [isToggling, setIsToggling] = useState(false);

  if (!post) return null;

  // 🚀 Step 1: Determine if the logged-in user liked this post from your new Prisma array filter
  const isLikedByMe = post.likes && post.likes.length > 0;

  const handleLikeToggle = async (e) => {
    e.preventDefault(); // Prevent accidental navigation triggers
    if (isToggling) return; // Prevent double clicks

    setIsToggling(true);

    try {
      if (isLikedByMe) {
        // 🚀 Step 2: If already liked, send a DELETE request to unlike it
        await axiosPrivate.delete(`/post/unlike/${post.id}`);
        
        // Update the parent component state layout
        if (onLikeUpdate) {
          onLikeUpdate(post.id, false);
        }
      } else {
        // 🚀 Step 3: If not liked, send a POST request to like it
        await axiosPrivate.post(`/post/like/${post.id}`);
        
        if (onLikeUpdate) {
          onLikeUpdate(post.id, true);
        }
      }
    } catch (err) {
      console.error("Error toggling like status:", err);
      alert("Something went wrong updating your like. Please try again.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="post-actions">
      {/* Turn the static span into a dynamic action button */}
      <button 
        className={`action-item like-btn ${isLikedByMe ? "liked" : ""}`}
        onClick={handleLikeToggle}
        disabled={isToggling}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {isLikedByMe ? "❤️" : "🤍"} {post._count?.likes || 0} Likes
      </button>
      
      <Link to={`/post/${post.id}`} className="action-item comments-link">
        <span>💬 {post._count?.comments || 0} Comments</span>
      </Link>
    </div>
  );
}

export default PostActions;