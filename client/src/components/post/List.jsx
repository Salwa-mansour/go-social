import { useAuth } from "../../hooks/useAuth";
import {Link} from "react-router-dom";
import DeletePostBtn from "./DeleteBtn";
import PostActions from "./PostActions";
import "../../css/post.css";



function PostList({ posts , setPosts }) {
  const { auth } = useAuth();

  const handleDeleteFromState = (deletedPostId) => {
  setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
  };

const handleLikeUpdateInState = (postId, willBeLiked) => {
  setPosts(prevPosts => 
    prevPosts.map(post => {
      if (post.id !== postId) return post;

      // Deep clone the post structure to safely update metrics nested inside
      return {
        ...post,
        // Update the mock likes array indicator block
        likes: willBeLiked ? [{ userId: auth.userId }] : [],
        // Increment or Decrement the calculated total metrics property
        _count: {
          ...post._count,
          likes: (post._count?.likes || 0) + (willBeLiked ? 1 : -1)
        }
      };
    })
  );
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
              <Link to={`post/${post.id}`}>
                  <p className="post-content">{post.content}</p>
                  <small className="post-date">
                    {new Date(post.createdAt).toLocaleString()}
                  </small>
              </Link>
            </div>
            
          <PostActions post={post} onLikeUpdate={handleLikeUpdateInState} />

          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;