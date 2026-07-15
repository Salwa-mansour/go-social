import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CreateComment({ postId }) {
  const [comment, setComment] = useState("");
  const axiosPrivate = useAxiosPrivate();
  
  // 🚀 FIX 1: Fixed casing of setError to match its usage below
  const [error, setError] = useState("");
  // 🚀 FIX 2: Clear boolean value initialization
  const [sending, setSending] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Comment content cannot be empty.");
      return;
    }

    setSending(true);
    try {
      const response = await axiosPrivate.post(`/comment/create/${postId}`, {
        content: comment,
      });
      console.log(response.data);
      setComment("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create comment");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="create-comment-container">
      <h3>Add a Comment</h3>
      {/* 🚀 FIX 3: Added the onSubmit handler so the form can actually send data */}
      <form onSubmit={handleSubmit}>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit"
          className="btn"
         disabled={sending} 
       
         >
          {sending ? "Posting..." : "Comment"}
          
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default CreateComment;