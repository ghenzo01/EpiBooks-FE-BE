import React from 'react'
import {ListGroup, Container, Row, Col, Button} from 'react-bootstrap'

import {jwtDecode} from 'jwt-decode'
import "./SingleComment.css"

const SingleComment = ({comment, handleEditRequest, deleteComment}) => {


    const token = localStorage.getItem('authToken')
    const loggedUserId = jwtDecode(token).id


    return (
        <ListGroup.Item className='p-0'>
            <Container className='single-comment pt-3 pb-3'>
                <Row>
                    <Col>
                        <p><strong>Comment ID:</strong> {comment._id}</p>
                    </Col>
                </Row>
                <Row className="align-items-center">

                    <Col>      
                        <p><strong>Author ID:</strong> {comment.author?._id}</p>
                    </Col>

                    <Col className="d-flex justify-content-end">
                        <p><strong>Posted:</strong> {new Date(comment.createdAt).toLocaleDateString()}</p>
                    </Col>

                </Row>

                <Row>
                    <Col>
                        <p><strong>Author Name:</strong> {comment.author?.userName}</p>
                    </Col>

                    <Col className="d-flex justify-content-end">
                        <p><strong>Rate:</strong> {comment.rate}/5</p>
                    </Col>

                </Row>

                <Row>
                    <Col>
                        <p className="comment-text"><strong>Comment:</strong> {comment.comment}</p>
                    </Col>
                </Row>

                {/*mostra i pulsanti di Edit e Delete solo se l'utente loggato è l'autore del commento */}
                {comment.author?._id === loggedUserId && (
                    <Row className="justify-content-end">
                        <Col className='d-flex gap-2 justify-content-end'>
                            <Button
                                variant="primary"
                                className="mt-3"
                                onClick={() => handleEditRequest(comment)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="secondary"
                                className="mt-3"
                                onClick={() => deleteComment(comment._id)}
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                )}
            </Container>
        </ListGroup.Item>
    )
}

export default SingleComment
