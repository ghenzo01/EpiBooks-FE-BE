import React from 'react'
import {useContext} from 'react'

import {Container, Row, Col} from 'react-bootstrap'
import {ThemeContext} from '../../context/ThemeContext'



import './NotFound.css'

const NotFound = () => {

    const {theme} = useContext(ThemeContext)


    return (
        <Container fluid className={`${theme === 'dark' ? 'text-white' : ''} ${theme === 'dark' ? 'dark-theme-colors' : ''} not-found d-flex flex-column justify-content-center align-items-center`}>
            <Row className="text-center">
                <Col>
                    <h5 className="mb-5">Oops, something went wrong</h5>

                    <h2>Page Not Found</h2>
                    <h1>404</h1>

                </Col>
            </Row>
        </Container>
    )
}

export default NotFound