import { useAuth } from "../../hooks/useAuth";
import {Link} from "react-router-dom";
import CreatePost from "./Create";
import DeletePostBtn from "./DeleteBtn";
import PostActions from "./PostActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit} from "@fortawesome/free-solid-svg-icons";
import "../../css/post.css";



function PostList({ posts , setPosts,pageOwnerId = 0 }) {
  const { auth } = useAuth();

const handlePostCreate = (post) => {
  // If the backend response lacks the populated author relational data, supply a fallback
  const completePostData = {
    ...post,
    author: post.author || {
      id: post.authorId || auth?.userId,
      name: auth?.username ,
      avatarUrl: auth?.avatarUrl || 'https://placehold.co/100'
    }
  };

  setPosts(prevPosts => [completePostData,...prevPosts]);
};
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
    <>
    
      {
        
          (pageOwnerId === auth.userId || pageOwnerId === 0) && (
          <CreatePost onPostCreate={handlePostCreate} />
          )
      }
   
    
   

    <div className="posts-container  glass-container">
      <ul className="posts-list">
        {posts.map((post) => (
         
          <li key={post.id} className="post-item glass-container">
            {
            auth?.userId === post.authorId && (
              <div className="post-actions-box">
               
                <Link to={`/post/edit/${post.id}`} className="action-btn edit-btn" title="edit post">
                    <FontAwesomeIcon icon={faEdit} />
                </Link>
                
                <DeletePostBtn postId={post.id} onDeleteSuccess={handleDeleteFromState} />
              </div>
            )
              
            }
       
            <figure className="post-author-info">
                <Link to={`/profile/${post.author.id}`}>
                    <div className="image">
                      <img 
                      src={post.author?.avatarUrl || 'https://placehold.co/100'} 
                      alt={`${post.author?.name || 'User'}'s profile`} 
                      width="100" 
                    />
                    </div>
                 
                    
                    <figcaption>@{post.author?.name || 'anonymous'}</figcaption>
                </Link>
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
    </>
  );
}

export default PostList;