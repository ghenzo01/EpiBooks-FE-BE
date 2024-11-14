import React, {useState, useEffect} from 'react'
import {jwtDecode} from 'jwt-decode'
import {Form, Button, Col, Row, Container} from 'react-bootstrap'
import "./AddComment.css"



const AddComment = ({asinForAddComment, addComment, commentToEdit, resetCommentToEdit, editComment}) => {

    const [newComment, setNewComment] = useState('')
    const [rating, setRating] = useState('1')
    const [authorId, setAuthorId] = useState(null)
    const [username, setUsername] = useState("")

    const ratingValues = [1, 2, 3, 4, 5]


    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            const decoded = jwtDecode(token)
            setAuthorId(decoded.id)
            setUsername(decoded.userName)
       }
   }, [])


    const handleClickOnReset = () => {
        resetCommentToEdit()
        setNewComment('')
        setRating(1)
   }



    useEffect(() => {
        if (commentToEdit) {
            setNewComment(commentToEdit.comment)
            setRating(commentToEdit.rate)
            setUsername(commentToEdit.author?.userName || "Unknown")
       } else 
        {
            setNewComment('')
            setRating(1)
       }
   }, [commentToEdit])



    const handleSubmit = (e) => {
        e.preventDefault()

        const comment = {

            comment: newComment,
            rate: rating,
            elementId: asinForAddComment,
            author: authorId
       }

        if (commentToEdit != null) {


            comment._id = commentToEdit._id
            editComment(comment)

       } else {
            addComment(comment)
       }
        handleClickOnReset()
   }

    return (
        <Container>
            <Form className='add-comment-form' onSubmit={handleSubmit} id="form">
                <Form.Group controlId="commentText">

                    {commentToEdit != null ? (
                        <>
                            <Row className="text-center text-warning">
                                <Col><h5><strong>EDIT YOUR COMMENT</strong></h5></Col>
                            </Row>

                            <Row className="mt-3">
                                <Col><p><strong>Comment ID:</strong> {commentToEdit._id}</p></Col>
                            </Row>

                            <Row>
                                <Col><p><strong>Author ID:</strong> {authorId}</p></Col>
                                <Col className="text-end"><p><strong>Posted:</strong> {new Date(commentToEdit.createdAt).toLocaleDateString()}</p></Col>
                            </Row>

                            <Row>
                                <Col><p><strong>Posting as:</strong> {username}</p></Col>
                            </Row>

                        </>
                    ) : 
                    (
                        <>
                            <Row className="text-center text-success">
                                <Col><h5><strong>ADD YOUR COMMENT</strong></h5></Col>
                            </Row>

                            <Row className="mt-3">
                                <Col><p><strong>User ID:</strong> {authorId}</p></Col>
                            </Row>

                            <Row>
                                <Col><p><strong>Posting as:</strong> {username}</p></Col>
                            </Row>
                        </>
                    )}

                    <Row className="align-items-center mt-4">
                        <Col className="col-auto">
                            <Form.Label className="mb-0"><strong>Rate this book:</strong></Form.Label>
                        </Col>

                        <Col sm={6}>

                            <Form.Control
                                as="select"
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                            >
                                {ratingValues
                                .map((ratingValue) => (
                                    <option key={ratingValue} value={ratingValue}>{ratingValue}</option>
                                ))}

                            </Form.Control>
                        </Col>

                    </Row>

                    <Row className="d-flex flex-column mt-4">
                        <Col><Form.Label><strong>Write your comment:</strong>
                        </Form.Label>
                        </Col>

                        <Col>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter your comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}

                            />
                        </Col>

                    </Row>
                </Form.Group>


                <Row className="mt-4 d-flex">
                    <Col className="d-flex justify-content-start">
                        <Button variant="warning" type="button" className="mt-3 text-white" onClick={handleClickOnReset}>
                            Reset
                        </Button>
                    </Col>

                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" type="submit" className="mt-3">
                            {commentToEdit != null ? 'Save Changes' : 'Add Comment'}
                        </Button>
                    </Col>

                </Row>

            </Form>

        </Container>
    )
}




export default AddComment
