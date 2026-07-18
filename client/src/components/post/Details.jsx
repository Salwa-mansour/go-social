import { useState, useEffect } from 'react';
import { useParams ,Link, useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from '../comment/Form';
import CommentList from '../comment/List';
import PostActions from './PostActions';
import DeletePostBtn from './DeleteBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit} from "@fortawesome/free-solid-svg-icons";
import "../../css/post.css";

function PostDetails() {
  const { postId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const {auth} = useAuth();

  const [post, setPost] = useState({});
  const [postComments,setPostComments]=useState([])
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
          setPostComments(response.data?.comments);
          
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
  const handleDeleteFromState = ()=>{
    navigate(`/`)
  }
const handleCommentsChange = (newComment) => {
  // 💡 Security Guard: Reject empty or corrupt comment objects
  if (!newComment || !newComment.id || !newComment.content) {
    console.warn("Skipped invalid comment data:", newComment);
    return;
  }

  setPostComments((prevComments) => {
    // Ensure we are working with an array fallback safely
    const currentComments = prevComments || [];
    
    const commentExists = currentComments.some(comment => comment.id === newComment.id);

    if (commentExists) {
      // 1. Update existing edited comment
      return currentComments.map(comment =>
        comment.id === newComment.id ? newComment : comment
      );
    } else {
      // 2. Prepend brand new comment
      return [newComment, ...currentComments];
    }
  });
};
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
                onCommentsChange={handleCommentsChange}
                onSuccess={(updatedComment) => {
                  
                  setActiveEditComment(null); 
                }} 
              />
          <CommentList  
          comments={postComments || []}
          setComments={setPostComments}
          setActiveEditComment={setActiveEditComment}
          postAuthorId={post.authorId} />
        </article> 
     </div>
  );
}

export default PostDetails;