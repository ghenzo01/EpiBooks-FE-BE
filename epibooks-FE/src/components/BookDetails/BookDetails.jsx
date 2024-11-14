import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import CommentArea from '../CommentArea/CommentArea'
import NotFound from '../NotFound/NotFound'
import { ThemeContext } from '../../context/ThemeContext'


import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

const BookDetails = () => {
  const { theme } = useContext(ThemeContext)
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [inCollection, setInCollection] = useState(false)
  const [loadingCollectionStatus, setLoadingCollectionStatus] = useState(true)

  const token = localStorage.getItem('authToken')
  const userId = jwtDecode(token).id

  const fetchBookDetails = async () => {
    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/books/${bookId}/details`)
      if (response.ok) {
        const data = await response.json()
        setBook(data.book)
        setComments(data.book.comments)

      } else {
        setBook(null)
      }
    } catch (error) {

      //console.error('Errore nel fetching', error)

      Swal.fire('Error', 'Failed to fetch book details', 'error')
      setBook(null)

    } finally {
      setLoading(false)
    }
  }



  const checkBookInCollection = async () => {
    setLoadingCollectionStatus(true)

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/collection`, {
        headers: { 'Authorization': token }
      })

      if (response.ok) {
        const data = await response.json()
        setInCollection(data.books.includes({ bookId }))
      } else {

        //console.error('Errore check utente')

        Swal.fire('Error', 'Failed to check collection', 'error')
      }

    } catch (error) {

      Swal.fire('Error', 'Error fetching user collection', 'error')

    } finally {

      setLoadingCollectionStatus(false)
    }
  }



  const addBookToCollection = async () => {
    if (!token) {
      Swal.fire('Error', 'No authorization token found', 'error')
      return
    }

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },

        body: JSON.stringify({ bookId })
      })


      if (response.ok) {
        setInCollection(true)
        Swal.fire('Success', 'Book successfully added to collection', 'success')
      } else {
        const errorData = await response.json()
        Swal.fire('Error', `Failed to add book to collection: ${errorData.message}`, 'error')
      }
    } catch (error) {

      //console.error('Errore aggiunta libro:', error)
      Swal.fire('Error', 'An error occurred while adding book to collection', 'error')
    }
  }



  useEffect(() => {
    fetchBookDetails()
    checkBookInCollection()
  }, [bookId, userId])

  const navigateBack = () => {
    navigate(-1)
  }

  if (loading) return <p>Loading...</p>
  if (!book) return <NotFound />


  return (
    <Container fluid className={`mt-3 ${theme === 'dark' ? 'dark-theme-colors text-white' : ''}`}>
      <Row>
        <Col md={4} className="d-flex align-items-center">
          <Button variant="primary" onClick={navigateBack} className="mb-4">
            &larr; Go Back
          </Button>
        </Col>
      </Row>

      <div className="p-4" style={{ borderRadius: '8px', boxShadow: 'none' }}>
        <Row>
          <Col md={4} className="d-flex justify-content-center align-items-center">
            <img src={book.img} alt={book.title} className="img-fluid" />
          </Col>
          <Col md={8}>
            <div className="mb-4 d-flex align-items-center">
              {loadingCollectionStatus ? (
                <p>Checking collection...</p>
              ) : inCollection ?

                (
                  <>
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span className="ms-2">Book already in your collection</span>
                  </>
                ) : (
                  <Button variant="outline-primary" onClick={addBookToCollection}>
                    Add book to collection
                  </Button>
                )}


            </div>
            <div className="mb-4"><small><strong>ID:</strong> {book._id}</small></div>
            <div className="mb-4"><small><strong>ASIN:</strong> {book.asin}</small></div>
            <h2>{book.title}</h2>

            <p><strong>Author:</strong> {'Author'}</p>
            <p><strong>Editor:</strong> {'Editor'}</p>
            <p><strong>Genre:</strong> {book.category.charAt(0).toUpperCase() + book.category.slice(1).toLowerCase()}</p>
            <p><strong>Price:</strong> {book.price}€</p>
            <p><strong>Summary:</strong> {'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}</p>
          </Col>
        </Row>
      </div>

      <Row className="mt-5 justify-content-center">

        <Col md={10}>
          <CommentArea
            bookIdForCommentArea={book._id}
            bookTitleForCommentArea={book.title}
            initialComments={comments}
            refreshBookDetails={fetchBookDetails}
          />

        </Col>
      </Row>
    </Container>
  )
}


export default BookDetails
