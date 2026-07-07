import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


function CommentForm({ postId, editData = null, onSuccess }) {
  const [comment, setComment] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false); 

  // Determine mode dynamically based on whether editData is passed
  const isEditMode = !!editData; 

  // If we are editing, populate the text field with the existing comment text
  useEffect(() => {
    if (isEditMode && editData?.content) {
      setComment(editData.content);
    } else {
      setComment(""); // Reset if switching back to create mode
    }
  }, [editData, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Comment content cannot be empty.");
      return;
    }

    setSending(true);
    try {
      let response;
      
      if (isEditMode) {
        //  EDIT MODE: Send a PUT request using the comment's unique ID
        response = await axiosPrivate.patch(`/comment/edit/${editData.id}`, {
          content: comment,
        });
      } else {
        //  CREATE MODE: Send a POST request using the parent post's ID
        response = await axiosPrivate.post(`/comment/create/${postId}`, {
          content: comment,
        });
      }

      console.log("Success:", response.data);
      setComment(""); 
      setError("");

   
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to ${isEditMode ? "update" : "create"} comment`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="comment-form-container">
      {/* Dynamic text labels change automatically */}
      <h3>{isEditMode ? "Edit your Comment" : "Add a Comment"}</h3>
      
      <form onSubmit={handleSubmit}>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isEditMode ? "Modify your comment..." : "Write a comment..."}
        />
        <button type="submit" disabled={sending}>
          {sending 
            ? (isEditMode ? "Updating..." : "Posting...") 
            : (isEditMode ? "Update" : "Comment")
          }
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default CommentForm;