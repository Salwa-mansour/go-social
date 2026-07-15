import { useState, useEffect } from 'react';
import { useParams ,Link} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import CommentForm from '../comment/Form';
import CommentList from '../comment/List';
import PostActions from './PostActions';
import "../../css/post.css";

function PostDetails() {
  const { postId } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [post, setPost] = useState({});
  const [loadingPost, setLoadingPost] = useState(true); // Default to true on initial mount
  const [error, setError] = useState("");
  const [activeEditComment, setActiveEditComment] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        setError("");
        setLoadingPost(true);
        const response = await axiosPrivate.get(`/post/details/${postId}`, {
          signal: controller.signal
        });
        
        if (isMounted) {
        
          setPost(response.data);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && isMounted) {
          console.error(err);
          setError("Failed to fetch post details");
        }
      } finally {
        if (isMounted) {
          setLoadingPost(false);
        }
      }
    };

    fetchPost(); 

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, postId]); 

  const handleLikeUpdateInDetails = (postId, willBeLiked) => {
  setPost((prevPost) => {
    // Safety guard to make sure we have post data to mutate
    if (!prevPost || prevPost.id !== postId) return prevPost;

    return {
      ...prevPost,
      // 🚀 1. Dynamically add or clear the local user like flag
      likes: willBeLiked ? [{ userId: "current-user-id" }] : [],
      // 🚀 2. Increment or decrement the global total likes count nested in _count
      _count: {
        ...prevPost._count,
        likes: (prevPost._count?.likes || 0) + (willBeLiked ? 1 : -1),
      },
    };
  });
};

  if (loadingPost) {
    return <p>Loading details...</p>;
  }
  
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div  className="main-content  glass-container top-container">
        <article className="post-detail" >
          <header> 
            <Link to={`/profile/${post.author.id}`}>
            <figure>
              <div className="image">
                  <img 
                    src={post.author?.avatarUrl || 'https://placehold.co/100'} 
                    alt={post.author?.name || 'User'} 
                    width="100" 
                  />
              </div>  
              <figcaption>@{post.author?.name || 'anonymous'}</figcaption>
            </figure>
                </Link>
          </header>
          
          <section className="post-content-area">
        
            <small>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</small>
            <p>{post.content}</p>
          </section>
          <PostActions post={post} onLikeUpdate={handleLikeUpdateInDetails} />
              <CommentForm 
                postId={postId} 
                editData={activeEditComment} 
                onSuccess={(updatedComment) => {
                  
                  setActiveEditComment(null); 
                }} 
              />
          <CommentList  comments={post.comments || []}
          setActiveEditComment={setActiveEditComment}
          postAuthorId={post.authorId} />
        </article> 
     </div>
  );
}

export default PostDetails;