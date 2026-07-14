import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faSpinner} from "@fortawesome/free-solid-svg-icons";




function DeletePostBtn({ postId, onDeleteSuccess }) {
  const axiosPrivate = useAxiosPrivate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Simple confirmation pop-up so users don't accidentally click it
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      // 🚀 Send the DELETE request to your backend
      await axiosPrivate.delete(`/post/${postId}`);
      
      // 🚀 Tell the parent component to instantly remove this post from the array state
      if (onDeleteSuccess) {
        onDeleteSuccess(postId);
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Could not delete post. Please try again.");
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
      <FontAwesomeIcon icon={faSpinner} /> : 
      <FontAwesomeIcon icon={faTrash} />}
    </button>
  );
}

export default DeletePostBtn;