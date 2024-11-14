import React, {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {Container, Form, Button} from 'react-bootstrap'
import Swal from 'sweetalert2'

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL


const Login = ({setIsAuthenticated}) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
 })

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
   }))
 }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
       },
        body: JSON.stringify(formData)
     })

      if (response.ok) {
        const data = await response.json()
        Swal.fire({
          icon: 'success',
          title: 'Login successful!',
          text: 'Welcome back!'
       })
        

        localStorage.setItem('authToken', data.token)
        console.log(data.token)


        setIsAuthenticated(true)
        navigate('/')
     } else {

        const errorData = await response.json()
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: errorData.message
       })

     }
   } catch (error) 
   {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred'
     })
   }
 }


  //login
  const handleGitHubLogin = () => {
    
    window.location.href = `${BACKEND_BASE_URL}/auth/github`
 }



  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Form onSubmit={handleLogin} className="w-50 p-4 border rounded">
        <h2 className="mb-4 text-center">Login</h2>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>

          <Form.Control
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>

          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Login
        </Button>

        {/* Pulsante login GitHub */}
        <Button variant="dark" type="button" className="w-100 mb-3" onClick={handleGitHubLogin}>
          Login with GitHub
        </Button>

        {/*
        <Button variant="danger" type="button" className="w-100 mb-3" onClick={handleGoogleLogin}>
          Login with Google
        </Button> */}

        <div className="text-center">
          <Link to="/register">Register</Link>
        </div>
      </Form>
    </Container>
  )
}


export default Login
