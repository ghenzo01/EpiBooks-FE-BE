import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { SingleBook } from '../SingleBook/SingleBook'
import Pagination from '../Pagination/Pagination'
import './AllTheBooks.css'

import Swal from 'sweetalert2'
import { jwtDecode } from 'jwt-decode'



const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL


export const AllTheBooks = ({ searchTextFromApp, selectedBook, setSelectedBook, isMyBooks }) => {
  const { theme } = useContext(ThemeContext)


  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [page, setPage] = useState(1)
  const pageSize = 16
  const [totalPages, setTotalPages] = useState(1)


  const fetchBooks = async (page, query) => {
    setIsLoading(true)
    try {

      const token = localStorage.getItem('authToken')

      const userId = jwtDecode(token).id

      let endpoint

      if (isMyBooks) {

        //modalità myBooks
        endpoint = `${BACKEND_BASE_URL}/users/${userId}/collection?page=${page}&pageSize=${pageSize}`


      } else if (query) {
        endpoint = `${BACKEND_BASE_URL}/books/search?query=${query}&page=${page}&pageSize=${pageSize}`
      } else {
        endpoint = `${BACKEND_BASE_URL}/books?page=${page}&pageSize=${pageSize}`
      }


      const response = await fetch(endpoint, {
        headers: isMyBooks
          ? { Authorization: token }
          : {},
      })


      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setBooks(data.books)
      setTotalPages(data.totalPages)
    } catch (error) {

      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      })


    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchBooks(page, searchTextFromApp)
  }, [page, searchTextFromApp])


  
  return (
    <Container
      fluid
      className={`justify-content-center ${theme === 'dark' ? 'dark-theme-colors' : 'bg-light'
        } text-${theme === 'dark' ? 'light' : 'dark'}`}
    >
      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <>
          <Row>
            {books.length > 0 ? (
              books.map((book) => (
                <Col md={3} className="mb-4" key={book._id}>
                  <SingleBook
                    bookId={book._id.toString()}
                    bookTitle={book.title}
                    bookImg={book.img}
                    bookPrice={book.price}
                    bookCategory={book.category}
                    setSelectedBook={setSelectedBook}
                    selectedBook={selectedBook}

                    //entro nel componente in modalità "MyBooks"
                    isMyBooks={isMyBooks}
                  />
                </Col>
              ))
            ) : (
              <p>No books available</p>
            )}
          </Row>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </Container>
  )
}
