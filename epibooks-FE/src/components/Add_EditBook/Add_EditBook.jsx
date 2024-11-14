import React, {useState, useEffect} from 'react'
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import Swal from 'sweetalert2'
import {useParams, useNavigate} from 'react-router-dom'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'



const Add_EditBook = ({isAddMode}) => {



  const [asin, setAsin] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [img, setImg] = useState('')
  const [uploadType, setUploadType] = useState('link')
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {bookId} = useParams()
  const navigate = useNavigate()

  const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

  useEffect(() => {
    if (!isAddMode && bookId) {


      setIsLoading(true)
      fetchBookDetails()
 } else {

      resetFormFields()
 }
}, [isAddMode, bookId])



  //dettagli libro
  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/books/${bookId}`)
      const data = await response.json()


      if (response.ok) {
        setAsin(data.asin)
        setPrice(data.price)
        setCategory(data.category)
        setTitle(data.title)
        setImg(data.img)
    } else {

        throw new Error(data.message)
    }
  } catch (error) {
      Swal.fire('Error', error.message, 'error')
  } finally {
      setIsLoading(false)
  }
}



  //reset
  const resetFormFields = () => {
    setAsin('')
    setPrice(0)
    setCategory('')
    setTitle('')
    setImg('')
    setFile(null)
    setUploadType('link')
}



  //elimina libro
  const handleDeleteBook = async () => {
    const confirmed = await Swal.fire({
      title: 'Delete Book?',
      text: 'Delete this book?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
  })

    if (confirmed.isConfirmed) {

      setIsLoading(true)

      try {
        const response = await fetch(`${BACKEND_BASE_URL}/books/${bookId}`, 
          
          {method: 'DELETE'})


        if (response.ok) {

          Swal.fire('Deleted!', 'The book has been deleted.', 'success')
          navigate('/')
      } else {
          throw new Error('Failed to delete the book')
      }
    } catch (error) {
        Swal.fire('Error', error.message, 'error')

    } finally {
        setIsLoading(false)
    }
  }
}



  //upload copertina su cloud
  const uploadFile = async (fileToUpload) => {

    const fileData = new FormData()
    fileData.append('img', fileToUpload)


    try {
      setIsLoading(true)
      const response = await fetch(`${BACKEND_BASE_URL}/books/uploadImage/cloudinary`, 

        {method: 'POST', 
          body: fileData})

      const data = await response.json()


      if (response.ok) {

        //link immagine
        return data.img 
    } else {

        throw new Error(data.message || 'File upload failed')
    }
  } catch (error) {

      setIsLoading(false)

      console.error('File upload error:', error)

      await Swal.fire('Error', error.message, 'error')
      return null
  }
}



  //salva o aggiorna il libro
  const handleSaveBook = (e) => {
    e.preventDefault()

    Swal.fire({
      title: isAddMode ? 'Add Book?' : 'Update Book?',

      text: isAddMode ? 'Are you sure you want to add this book?' : 'Are you sure you want to update this book?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',

  }).then(async (result) => 
      
      {
      if (result.isConfirmed) {
        setIsLoading(true)
        let imgURL = img
        if (uploadType === 'file' && file) {
          imgURL = await uploadFile(file)

          if (!imgURL) return setIsLoading(false)
      }


        const bookData = {asin, price, category, title, img: imgURL}

        try {
          const endpoint = isAddMode ? `${BACKEND_BASE_URL}/books/create` : `${BACKEND_BASE_URL}/books/update/${bookId}`
          const method = isAddMode ? 'POST' : 'PATCH'


          const response = await fetch(endpoint, {
            method,
            headers: {'Content-Type': 'application/json'},

            body: JSON.stringify(bookData),

        })


          const data = await response.json()
          if (response.ok) {

            Swal.fire('Success', isAddMode ? 'The book has been added successfully' : 'The book has been updated successfully', 'success')

            navigate('/')
        } else {

            throw new Error(data.message)
        }
      } catch (error) {

          Swal.fire('Error', error.message, 'error')
          //console.error("Error in saving book:", error)
      } finally {
          setIsLoading(false)
      }
    }

  })
}

  return (
    <Container>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row className="mt-4 mb-4">
            <Col>
              {!isAddMode && (

                <Button variant="danger" className="mb-2" onClick={handleDeleteBook}>
                  Delete Book
                </Button>
              )}

              <h2>{isAddMode ? 'Add Book' : 'Edit Book'}</h2>
            </Col>


          </Row>

          <Form onSubmit={handleSaveBook}>
            {!isAddMode && (
              <Form.Group controlId="bookId">
                <Form.Label><strong style={{fontSize: '1.2em'}}>ID:</strong> {bookId}
                </Form.Label>

              </Form.Group>
            )}

            <Form.Group controlId="asin">
              <Form.Label>ASIN</Form.Label>
              <Form.Control type="text" value={asin} onChange={(e) => setAsin(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="imgType">


              <Form.Label>Image Upload Type</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Image URL"
                  name="imgType"
                  value="link"
                  checked={uploadType === 'link'}
                  onChange={() => setUploadType('link')}
                />

                <Form.Check
                  type="radio"
                  label="Select File"
                  name="imgType"
                  value="file"
                  checked={uploadType === 'file'}
                  onChange={() => setUploadType('file')}
                />
              </div>
            </Form.Group>

            {uploadType === 'link' ? (


              <Form.Group controlId="imgLink">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text" value={img} onChange={(e) => setImg(e.target.value)} />
              </Form.Group>
            ) : 
            
            (
              <Form.Group controlId="imgFile">
                <Form.Label>Choose Image</Form.Label>
                <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
              </Form.Group>
            )}




            <Button variant="primary" type="submit" className="mt-3 mb-4">
              {isAddMode ? 'Save Book' : 'Update Book'}
            </Button>
          </Form>
        </>


      )}
    </Container>

  )
}


export default Add_EditBook
