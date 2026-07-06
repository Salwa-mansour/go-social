
import  useAxiosPrivate  from "../../hooks/useAxiosPrivate";
import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";


function EditPost() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const {postId} = useParams();
  const [postContent,setPostContent]=useState("");
  const [error,setError]=useState("");
  const [sendingPost,setSendingPost]=useState(false);

useEffect(() => {
  let isMounted = true;
  const controller = new AbortController();

  const fetchPost = async () => {
    try {
      const response = await axiosPrivate.get(`/post/${postId}`, {
        signal: controller.signal
      });
      
      if (isMounted) {
        // Safe access to your nested content data
        setPostContent(response.data.content || response.data);
      }
    
    } catch (err) {
      if (err.name !== 'CanceledError' && isMounted) {
        console.error(err);
        setError("Failed to fetch post");
      }
    }
  };

  fetchPost(); // 🚀 1. MUST CALL THE FUNCTION HERE TO INITIATE IT

  return () => {
    isMounted = false;
    controller.abort(); // Cleans up if user hits back quickly
  };
}, [axiosPrivate, postId]); // 🚀 2. ADDED postId TO DEPENDENCY LIST

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    //  Strip out whitespace and check if empty
    if (!postContent.trim()) {
      setError("Post content cannot be empty.");
      return;
    }
    setSendingPost(true);
    try{
      const response = await axiosPrivate.patch(`/post/edit/${postId}`,{content:postContent});
      console.log(response.data);
      setPostContent("");
      setError("");
       navigate(`/`); 
    }
    catch(err){
      console.error(err);
      setError("Failed to update post");
    }
    finally{
      setSendingPost(false);
    }
  }
  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
         <textarea
          value={postContent}
          onChange={(e)=>setPostContent(e.target.value)} 
          />
        <button type="submit" disabled={sendingPost}>{`${sendingPost? "updating ...":"Update"}`}</button>
        {error && <p style={{color:'red'}}>{error}</p>}
           
      </form>
    </div>
  )
}

export default EditPost