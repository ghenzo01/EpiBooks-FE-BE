import React, {useState} from 'react'
import {Row, Col} from 'react-bootstrap'
import Swal from 'sweetalert2'
import CommentList from '../CommentList/CommentList'
import AddComment from '../AddComment/AddComment'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import {CONTENT_TYPE} from '../../data/constants'
import './CommentArea.css'

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL

const CommentArea = ({bookIdForCommentArea, bookTitleForCommentArea, initialComments, refreshBookDetails}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState(initialComments)
  const [commentToEdit, setCommentToEdit] = useState(null)


  const handleEditRequest = (comment) => {
    setCommentToEdit(comment)
 }


  const resetCommentToEdit = () => {
    setCommentToEdit(null)
 }


  const showErrorAlert = (title, errorMessage) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: errorMessage,
      confirmButtonColor: '#d33',
   })
 }

  const confirmAction = async (message) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',

   })

    return result.isConfirmed
 }


  const addComment = async (comment) => {
    const token = localStorage.getItem('authToken')

    //console.log("add comment", token)


    if (!token) {
      showErrorAlert('Unauthorized', 'Please log in to comment')
      return
   }


    const confirmed = await confirmAction("Do you want to add the comment?")
    if (!confirmed) return

    try {
      setIsLoading(true)
      const response = await fetch(`${BACKEND_BASE_URL}/comments/create`, {
        method: 'POST',
        headers: {
          "Content-Type": CONTENT_TYPE,
          "Authorization": token
       },
        body: JSON.stringify({
          ...comment,
          book: bookIdForCommentArea
       })
     })

      if (!response.ok) {
        throw new Error('Failed to add comment')
     }

      refreshBookDetails()
   } catch (error) {

      showErrorAlert('Error during POST', error.message)
   } finally {
      setIsLoading(false)
   }

 }


  const editComment = async (comment) => {
    const token = localStorage.getItem('authToken')

    if (!token) {
      showErrorAlert('Unauthorized', 'Please log in to edit the comment')
      return
   }


    const confirmed = await confirmAction("Do you want to edit comment?")
    if (!confirmed) return


    try {
      setIsLoading(true)
      const response = await fetch(`${BACKEND_BASE_URL}/comments/${comment._id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": CONTENT_TYPE,
          "Authorization": token
       },

        body: JSON.stringify({
          ...comment,
          book: bookIdForCommentArea
       })
     })


      if (!response.ok) {
        throw new Error('Failed to edit comment')
     }

      refreshBookDetails()
   } catch (error) {

      showErrorAlert('Error during PUT', error.message)
   } finally {
      setIsLoading(false)
   }
 }


  const deleteComment = async (commentId) => {
    const token = localStorage.getItem('authToken')

    if (!token) {
      showErrorAlert('Unauthorized', 'Please log in to delete comment')
      return
   }

    const confirmed = await confirmAction("Do you want to delete comment?")

    if (!confirmed) return

    try {
      setIsLoading(true)
      const response = await fetch(`${BACKEND_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": CONTENT_TYPE,
          "Authorization": token
       }
     })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
     }

      refreshBookDetails()
   } catch (error) {
      showErrorAlert('Error during DELETE', error.message)
   } finally {
      setIsLoading(false)
   }
 }



  return (
    <div className="d-flex flex-column g-4 mb-5">
      <Row className="mb-3">

        <Col className="text-center">
          <h4>Comments for: </h4>
          <h6>ID: {bookIdForCommentArea}</h6>
          <h3>{bookTitleForCommentArea}</h3>
        </Col>

      </Row>


      {isLoading ? (
        <LoadingSpinner text="Operation in progress, please wait..." />
      ) : (
        <>

          <Row className="d-flex g-4">
            <Col md={6}>

              <AddComment
                bookIdForAddComment={bookIdForCommentArea}
                addComment={addComment}
                commentToEdit={commentToEdit}
                resetCommentToEdit={resetCommentToEdit}
                editComment={editComment}
              />
            </Col>

            <Col md={6}>
              {comments.length === 0 ? (
                <div className="d-flex flex-column align-items-center">
                  <h5>No comments available for this book.</h5>
                  <h6>Be the first to comment on it!</h6>
                </div>
              ) :
                (
                  <CommentList
                    comments={comments}
                    handleEditRequest={handleEditRequest}
                    deleteComment={deleteComment}
                  />
                )}

            </Col>
          </Row>
        </>
      )}
    </div>
  )

}

export default CommentArea
