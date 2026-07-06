import  useAxiosPrivate  from "../../hooks/useAxiosPrivate";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [postContent,setPostContent]=useState("");
  const [error,setError]=useState("");
  const [sendingPost,setSendingPost]=useState(false);

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
      const response = await axiosPrivate.post('/post/create',{content:postContent});
      console.log(response.data);
      setPostContent("");
      setError("");
      // navigate("/");
    }
    catch(err){
      console.error(err);
      setError("Failed to create post");
    }
    finally{
      setSendingPost(false);
    }
  }


  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={postContent}
          onChange={(e)=>setPostContent(e.target.value)} 
          />
        <button type="submit" disabled={sendingPost}>{`${sendingPost? "creating ...":"Create"}`}</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  )
}

export default CreatePost