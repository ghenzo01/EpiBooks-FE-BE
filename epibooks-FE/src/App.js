import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Container, Row, Col } from 'react-bootstrap'
import MyNav from './components/MyNav/MyNav'
import Welcome from './components/Welcome/Welcome'
import 'bootstrap/dist/css/bootstrap.min.css'
import MyFooter from './components/MyFooter/MyFooter'
import { AllTheBooks } from './components/AllTheBooks/AllTheBooks'
import BookDetails from './components/BookDetails/BookDetails'
import NotFound from './components/NotFound/NotFound'
import Add_EditBook from './components/Add_EditBook/Add_EditBook'
import UserForm from './components/UserForm/UserForm'
import Login from './components/Login/Login'
import ThemeProvider from './context/ThemeContext'
import EmailForm from './components/EmailForm/EmailForm'
import GitHubRedirect from './components/GitHubRedirect/GitHubRedirect'
import SuccessPage from './components/SuccessPage/SuccessPage'
import logoForLightTheme from './images/logoForLightTheme.png'
import logoForDarkTheme from './images/logoForDarkTheme.png'
import { welcomeText, aboutUsText, copyrightText } from './data/texts'



const Layout = ({ children, searchText, handleInputChange, executeSearch }) => {
  return (



    <>
      <MyNav
        logoForLightTheme={logoForLightTheme}
        logoForDarkTheme={logoForDarkTheme}
        searchText={searchText}
        handleInputChange={handleInputChange}
        executeSearch={executeSearch}
      />

      {/* tutti i componenti figli che stanno tra navbar e footer */}
      {children}

      <MyFooter aboutUsTextInFooter={aboutUsText} copyrightTextInFooter={copyrightText} />
    </>

  )
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(token !== null)
  }, [])


  const executeSearch = () => {
    setSearchQuery(searchText)
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* rotte che non stanno tra navbar e footer */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<UserForm />} />
          <Route path="/success/:token" element={<SuccessPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/auth/github/callback" element={<GitHubRedirect />} />


          {isAuthenticated ? (
            <Route
              path="*"
              
              element={
                
                // Layout: sopra a dove si apre ci sta quello che è sopra nella sua definizione, ossia la navbar
                <Layout
                  searchText={searchText}
                  handleInputChange={(e) => setSearchText(e.target.value)}
                  executeSearch={executeSearch}
                >

                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <Welcome welcomeTextForWelcomeComponent={welcomeText} />
                          <Container fluid>
                            <Row>
                              <Col>
                                <AllTheBooks
                                  searchTextFromApp={searchQuery}
                                  selectedBook={selectedBook}
                                  setSelectedBook={setSelectedBook}
                                />
                              </Col>
                            </Row>
                          </Container>
                        </>
                      }
                    />

                    <Route
                      path="/my-books"
                      element={
                        <Container fluid>
                          <Row>
                            <Col>
                              <AllTheBooks
                                isMyBooks={true}
                                selectedBook={selectedBook}
                                setSelectedBook={setSelectedBook}
                              />
                            </Col>
                          </Row>
                        </Container>

                      }
                    />
                    <Route path="/book-details/:bookId" element={<BookDetails />} />
                    <Route path="/manage-book/:bookId" element={<Container><Row><Col><Add_EditBook isAddMode={false} /></Col></Row></Container>} />
                    <Route path="/add-book" element={<Container><Row><Col><Add_EditBook isAddMode={true} /></Col></Row></Container>} />
                    <Route path="/mail" element={<Container className="mt-4"><Row><Col><EmailForm /></Col></Row></Container>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>

                  {/* Layout: sotto a dove si chiude ci sta quello che è sotto nella sua definizione, ossia il footer */}
                </Layout>
              }
            />
          ) : (


            <Route path="*" element={<Navigate to="/login" />} />

          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
