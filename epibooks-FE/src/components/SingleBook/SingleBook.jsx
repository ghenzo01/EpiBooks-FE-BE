import React, { useContext } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import Swal from 'sweetalert2'
import './SingleBook.css'

import {jwtDecode} from 'jwt-decode'


const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL
const token = localStorage.getItem('authToken')
const userId = jwtDecode(token).id


export const SingleBook = ({
  bookId,
  bookTitle,
  bookImg,
  bookPrice,
  bookCategory,
  selectedBook,
  setSelectedBook,
  isMyBooks,
}) => {

  const { theme } = useContext(ThemeContext)
  const isSelected = selectedBook === bookId
  const navigate = useNavigate()



  const handleClickOnCard = () => {
    setSelectedBook(bookId)
  }



  const navigateToBookDetails = () => {
    navigate(`/book-details/${bookId}`)
  }



  const handleRemoveBook = async () => {
    try {
      const confirm = await Swal.fire({
        title: 'Remove?',
        text: 'Remove book from collection?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      })

      if (confirm.isConfirmed) {
        const response = await fetch(
          `${BACKEND_BASE_URL}/users/${userId}/collection`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
            body: JSON.stringify({ bookId }),
          }
        )

        //console.log("userid: ", userId, "bookId:", bookId  )

        if (!response.ok) {
          throw new Error('Failed to remove book')
        }

        Swal.fire('Removed!', 'Book removed.', 'success')
      }
      
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  return (
    <>
      <Card onClick={handleClickOnCard} className={` ${theme === 'dark' ? 'dark-theme-colors' : ''}`}>
        <Card.Body className={`d-flex flex-column ${theme === 'dark' ? 'dark-theme-colors' : ''}`}>
          <Card.Img
            className="singleBookImg"
            variant="top"
            src={bookImg}
            alt={`${bookTitle} cover`}
          />

          <Card.Title className="card-title">{bookTitle}</Card.Title>

          <p
            className={`book-category me-auto ${
              theme === 'dark' ? 'dark-theme-colors' : ''
            }`}
          >
            Genre: {bookCategory.charAt(0).toUpperCase() + bookCategory.slice(1).toLowerCase()}
          </p>
          <p className="book-price text-center">Price: {bookPrice}€</p>

          <Button variant="primary" onClick={navigateToBookDetails}>
            Explore Details
          </Button>

          {isMyBooks ? (
            <Button variant="danger" onClick={handleRemoveBook} className="mt-2">
              Remove
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => navigate(`/manage-book/${bookId}`)} className="mt-2">
              Manage
            </Button>
          )}
        </Card.Body>
      </Card>
    </>
  )
}
