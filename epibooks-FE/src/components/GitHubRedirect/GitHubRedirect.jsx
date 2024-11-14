import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const GitHubRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()


  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')

    //console.log("sono in github redirect")

    const timer = setTimeout(() => {
      if (code) {
        navigate('/')
      } else {
        navigate('/login')
      }
    }, 3000)


    return () => clearTimeout(timer)
  }, [navigate, location])

  
  const params = new URLSearchParams(location.search)
  const code = params.get('code')

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <h1>{code ? 'Redirecting to home...' : 'Oops, something went wrong'}</h1>
    </div>
  )
}

export default GitHubRedirect
