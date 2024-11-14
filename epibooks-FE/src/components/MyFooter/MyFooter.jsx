import {useContext} from 'react'
import {ThemeContext} from '../../context/ThemeContext'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'

import {footerLinks_col2} from '../../data/footerlinks'
import {footerLinks_col3} from '../../data/footerlinks'

import Nav_FootLink from '../Nav_FootLink/Nav_FootLink'
import './MyFooter.css'

const MyFooter = (props) => {

  const {theme} = useContext(ThemeContext)

  return (
    <footer className={`bg-${theme === 'dark' ? 'secondary' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'} py-4 mt-auto`}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              {props.aboutUsTextInFooter}
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <Nav className="flex-column">

              {footerLinks_col2.map((footerLink_col2, index) =>

                <Nav_FootLink

                  //uso la key e l'index dell'elemento nell'array per evitare il warining di React. Key non viene passata come prop,
                  //è una parola chiave riservata e index è di volta in volta l'indice corrente dell'array restituito dal map.
                  key={index}
                  href={footerLink_col2.href}
                  text={footerLink_col2.text}


                />
              )}
            </Nav>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <Nav className="flex-column">

              {footerLinks_col3.map((footerLink_col3, index) =>

                <Nav_FootLink

                  //uso la key e l'index dell'elemento nell'array per evitare il warining di React. Key non viene passata come prop,
                  //è una parola chiave riservata e index è di volta in volta l'indice corrente dell'array restituito dal map.
                  key={index}
                  href={footerLink_col3.href}
                  text={footerLink_col3.text}


                />
              )}

            </Nav>
          </Col>
        </Row>
        <Row className="text-center mt-3">
          <Col>
            <p> {props.copyrightTextInFooter}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default MyFooter