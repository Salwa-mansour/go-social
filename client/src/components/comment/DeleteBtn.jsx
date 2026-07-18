import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash ,faSpinner} from "@fortawesome/free-solid-svg-icons";

function DeleteCommentBtn({ commentId,onCommentDelete }) {
  const axiosPrivate = useAxiosPrivate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Simple confirmation pop-up so users don't accidentally click it
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);
    try {
     
      await axiosPrivate.delete(`/comment/${commentId}`);
      
      //  Tell the parent component to instantly remove this comment from the array state
      if (onCommentDelete) {
        onCommentDelete(commentId);
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Could not delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      className="btn"
      onClick={handleDelete}
      disabled={isDeleting}
      title={isDeleting ? "Deleting..." : "Delete"}
    >
      {isDeleting ? 
      <FontAwesomeIcon icon={faSpinner} />
       : <FontAwesomeIcon icon={faTrash} />}
    </button>
  );
}

export default DeleteCommentBtn;