import { Link } from "react-router-dom";

function PostActions({ post }) {
  if (!post) return null;

  return (
    <div className="post-actions">
      <span className="action-item likes-count">
        ❤️ {post._count?.likes || 0} Likes
      </span>
      
      <Link to={`/post/${post.id}`} className="action-item comments-link">
        <span>💬 {post._count?.comments || 0} Comments</span>
      </Link>
    </div>
  );
}

export default PostActions;