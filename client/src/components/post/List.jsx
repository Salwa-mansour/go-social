import { useAuth } from "../../hooks/useAuth";
import {Link} from "react-router-dom";
import DeletePostBtn from "./DeleteBtn";
import "../../css/post.css";



function PostList({ posts , setPosts }) {
  const { auth } = useAuth();

  const handleDeleteFromState = (deletedPostId) => {
  setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
  };

  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="posts-container">
      <ul className="posts-list">
        {posts.map((post) => (
         
          <li key={post.id} className="post-container">
            {
            auth?.userId === post.authorId && (
              <div className="post-actions-box">
               
                <Link to={`/post/edit/${post.id}`} className="action-btn edit-btn">
                  Edit
                </Link>
                
                <DeletePostBtn postId={post.id} onDeleteSuccess={handleDeleteFromState} />
              </div>
            )
              
            }
       
            <figure className="post-author-info">
              <img 
                src={post.author?.avatarUrl || 'https://placehold.co/100'} 
                alt={`${post.author?.name || 'User'}'s profile`} 
                width="100" 
              />
              
              <figcaption>@{post.author?.name || 'anonymous'}</figcaption>
            </figure>
            
            <div className="post-body">
              <p className="post-content">{post.content}</p>
              <small className="post-date">
                {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
            
          
            <div className="post-footer">
              <span>❤️ {post._count?.likes || 0} Likes</span>
              <span>💬 {post._count?.comments || 0} Comments</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;