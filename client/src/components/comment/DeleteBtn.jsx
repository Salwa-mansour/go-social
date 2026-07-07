import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";

function DeleteCommentBtn({ commentId }) {
  const axiosPrivate = useAxiosPrivate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Simple confirmation pop-up so users don't accidentally click it
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);
    try {
     
      await axiosPrivate.delete(`/comment/${commentId}`);
      
      // 🚀 Tell the parent component to instantly remove this comment from the array state
    //   if (onDeleteSuccess) {
    //     onDeleteSuccess(commentId);
    //   }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Could not delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      className="action-btn delete-btn"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}

export default DeleteCommentBtn;