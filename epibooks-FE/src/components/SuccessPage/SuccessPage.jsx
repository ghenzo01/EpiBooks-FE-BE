import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import {jwtDecode} from 'jwt-decode'

const SuccessPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {

    //recupera il token
    const pathParts = location.pathname.split('/')
    const token = pathParts[pathParts.length - 1]

    console.log('Token ricevuto:', token)


    if (token) {
      try {
      
        const decoded = jwtDecode(token)
        console.log('Token decodificato:', decoded)

        localStorage.setItem('authToken', token)
        setIsAuthenticated(true)

        //redirige alla homepage dopo 3 secondi
        setTimeout(() => navigate('/'), 3000)

      } catch (error) {

        console.error('Token non valido:', error)

        //redirige a pagina di login
        setTimeout(() => navigate('/login'), 3000)
      }
    } else {

      console.error('Token non trovato')

      //redirige a pagina di login
      setTimeout(() => navigate('/login'), 3000)

    }
  }, [navigate, location, setIsAuthenticated])

  
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <h1>Loading...</h1>
    </div>
  )
}

export default SuccessPage
