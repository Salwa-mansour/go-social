import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import CommentForm from '../comment/Form';
import CommentList from '../comment/List';

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

  if (loadingPost) {
    return <p>Loading details...</p>;
  }
  
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <article className="post-detail-view">
      <header>
        <figure>
   
          <img 
            src={post.author?.avatarUrl || 'https://placehold.co/100'} 
            alt={post.author?.name || 'User'} 
            width="100" 
          />
          <figcaption>@{post.author?.name || 'anonymous'}</figcaption>
        </figure>
      </header>
      
      <section className="post-content-area">
     
        <small>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</small>
        <p>{post.content}</p>
      </section>
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
  );
}

export default PostDetails;