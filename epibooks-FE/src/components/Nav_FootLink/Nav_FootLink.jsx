//uso la classe Nav.Link di Bootstrap per crearmi gli elementi NavLink e passo al componente le props come array, senza destrutturare

import {useContext} from 'react'
import {ThemeContext} from '../../context/ThemeContext'

import Nav from 'react-bootstrap/Nav'
import "./Nav_FootLink.css"

const Nav_FootLink = (props) => {

    const {theme} = useContext(ThemeContext)

    return (
        <Nav.Link
            href={props.href}
            className={`nav-link text-${theme === 'dark' ? 'light' : 'dark'}`}
        >

            {props.text}

        </Nav.Link>
    )
}

export default Nav_FootLink