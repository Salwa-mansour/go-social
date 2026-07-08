import { useAuth } from "../../hooks/useAuth";
import DeleteCommentBtn from "./DeleteBtn";


function CommentList({ comments,setActiveEditComment,postAuthorId }) {
   const { auth } = useAuth();

  // 1. Guard clause if there are no comments yet
 
  if (!comments || comments.length === 0) {
    return (
      <div className="no-comments">
        <p>No comments yet. Be the first to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>
      
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <div className="comment-header">
              {/* Optional profile visual details if your backend includes them */}
              {comment.author && (
                <figure className="comment-author-info">
                  <img 
                    src={comment.author.avatarUrl || 'https://placehold.co/40'} 
                    alt={`${comment.author.name || 'User'}'s avatar`} 
                    className="comment-avatar"
                    width="40"
                  />
                  <figcaption className="comment-username">
                    <strong>@{comment.author.name || 'anonymous'}</strong>
                  </figcaption>
                </figure>
              )}
              
              {comment.createdAt && (
                <small className="comment-date">
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              )}
           
              <div className="comment-actions-box">
            
                {auth?.userId === comment.authorId && (
                  <button onClick={() => setActiveEditComment(comment)}>Edit</button>
                )}

              
                {(auth?.userId === comment.authorId || auth?.userId === postAuthorId) && (
                  <DeleteCommentBtn commentId={comment.id}  /> 
                  /* Or use your component once it's ready:
                  <DeleteCommentBtn commentId={comment.id} onDeleteSuccess={handleDeleteFromState} /> 
                  */
                )}
              </div>
            </div>

            <div className="comment-body">
              <p className="comment-content">{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;