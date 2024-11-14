import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Form, Button, Container} from 'react-bootstrap'
import Swal from 'sweetalert2'

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL


const UserForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userName: '',
    dob: '',
    role: '',
  })


  const handleChange = (e) => {
    const {name, value} = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
   }))
 }


  const handleSubmit = async (e) => {
    e.preventDefault()


    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to register?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
   })

    if (!confirmed.isConfirmed) return

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
       },
        body: JSON.stringify(formData),
     })

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'Your account has been created successfully.',
       })

        setFormData({
          email: '',
          password: '',
          userName: '',
          dob: '',
          role: '',
       })

        navigate('/')
     } else {
        const errorData = await response.json()
        Swal.fire({
          icon: 'error',
          title: 'Registration error',
          html: errorData.errors ? errorData.errors.join('<br>') : 'An error occurred. Please try again.',
       })
     }

   } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
     })
   }
 }

  return (
    <Container>
      <h2 className="mt-4">Registration</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formDob" className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formRole" className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select role</option>
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  )
}


export default UserForm
