import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Form, Button, Container} from 'react-bootstrap'
import Swal from 'sweetalert2'

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

const EmailForm = () => {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()

    const mailData = {
      to: email,
      subject: subject,
      emailText: message,
   }

    const token = localStorage.getItem('authToken')


    try {
      const response = await fetch(`${BACKEND_BASE_URL}/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
       },
        body: JSON.stringify(mailData),
     })

      if (response.ok) {
        Swal.fire({
          title: 'Success',
          text: 'Mail successfully sent!',
          icon: 'success',
       }).then(() => {
          navigate('/') 
       })
        setEmail('')
        setSubject('')
        setMessage('')

     } else 
     
     {
        const errorData = await response.json()
        const errorMessages = Array.isArray(errorData.errors)? 
        
        errorData.errors.join('\n')
          : errorData.message
          
        Swal.fire('Error', errorMessages, 'error')
     }

   } catch (error) {
      //console.error('Errore invio mail', error)

      Swal.fire('Error', 'Connection error', 'error')
   }
 }


  return (
    <Container className="mt-4">

      <h2>Send e-Mail</h2>

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Send to: </Form.Label>
          <Form.Control
            placeholder="Send to: "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSubject">
          <Form.Label>Title: </Form.Label>
          <Form.Control
            placeholder="Title: "
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>Body: </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Text: "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  )
}

export default EmailForm
