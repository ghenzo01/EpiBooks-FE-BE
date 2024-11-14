import {useContext} from 'react'
import {useLocation, Link} from 'react-router-dom'
import {Container, Nav, Navbar, Button} from 'react-bootstrap'
import {jwtDecode} from 'jwt-decode'

import {ThemeContext} from '../../context/ThemeContext'
import Logo from '../Logo/Logo'
import Nav_FootLink from '../Nav_FootLink/Nav_FootLink'
import SearchBar from '../SearchBar/SearchBar'
import './MyNav.css'

import {menuLinks_1} from '../../data/navlinks'


const MyNav = ({logoForLightTheme, logoForDarkTheme, searchText, handleInputChange, executeSearch}) => {

  const currentLocation = useLocation()
  const {theme, selectTheme} = useContext(ThemeContext)

  //estrai dati da token
  const token = localStorage.getItem('authToken')
  let username = ''
  let role = ''


  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      username = decodedToken.userName || 'Guest'
      role = decodedToken.role || '(role unspecified)'
  } catch (error) {

      console.error('Error in decoding token:', error)
   }
 }

  return (
    <Navbar expand="lg"
      className={`bg-${theme === 'dark' ? 'secondary' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'}`}
    >
      <Container fluid className={`bg-${theme === 'dark' ? 'secondary' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'}`}>

        <Navbar.Brand className={`d-flex align-items-center text-${theme === 'dark' ? 'light' : 'dark'}`}>
          <Logo imgForLogo={theme === 'light' ? logoForLightTheme : logoForDarkTheme} />
          <span className="ms-2">EpiBooks</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll" className="d-flex align-items-center">
          <Nav className="me-auto my-2 my-lg-0 ms-5 d-flex align-items-center" style={{maxHeight: '100px'}} navbarScroll>
            {menuLinks_1.map((menuLink, index) =>
              <Nav_FootLink key={index} href={menuLink.href} text={menuLink.text} />
            )}

            <Nav.Item className="ms-3">
              <Link to="/add-book" className={`nav-link text-${theme === 'dark' ? 'light' : 'dark'}`}>
                Add Book
              </Link>
            </Nav.Item>

            <Nav.Item className="ms-3">
              <Link to="/mail" className={`nav-link text-${theme === 'dark' ? 'light' : 'dark'}`}>
                Mail
              </Link>
            </Nav.Item>

            <Nav.Item className="ms-3">
              <Link to="/my-books" className={`nav-link text-${theme === 'dark' ? 'light' : 'dark'}`}>
                My Books
              </Link>
            </Nav.Item>

            <Nav.Item className="ms-3">
              <Link to="/my-profile" className={`nav-link text-${theme === 'dark' ? 'light' : 'dark'}`}>
                My Profile
              </Link>
            </Nav.Item>

            <Nav.Item className="ms-3">
              <Link to="/users" className={`nav-link text-${theme === 'dark' ? 'light' : 'dark'}`}>
                Users
              </Link>
            </Nav.Item>

            <Nav.Item className="ms-3">
              <Link to="/manage-users" className={`nav-link text-${theme === 'dark' ? 'light' : 'dark'}`}>
                Manage Users
              </Link>
            </Nav.Item>
          </Nav>

          <div className="search-bar-container justify-content-end me-3">
            {!currentLocation.pathname.startsWith('/book-details/') && (

              <SearchBar
                searchText={searchText}
                handleInputChange={handleInputChange}
                triggerSearch={executeSearch}
              />
            )}
          </div>

          <div className="text-end me-3">
            <small>Logged as</small>
            <div><strong>{username}</strong></div>
            <small>Role: {role}</small>
          </div>

          <Button variant={theme === 'dark' ? 'light' : 'dark'} onClick={selectTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNav
