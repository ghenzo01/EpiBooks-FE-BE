import React from 'react'
import SingleComment from '../SingleComment/SingleComment'
import {ListGroup} from 'react-bootstrap'



const CommentList = ({comments, handleEditRequest, deleteComment}) => {

  return (

    <ListGroup className="d-flex flex-column">
      {comments.map((comment) => (

        <SingleComment
          key={comment._id}
          comment={comment}
          handleEditRequest={handleEditRequest}
          deleteComment={deleteComment}
          
        />



      ))}
    </ListGroup>
  )
}

export default CommentList