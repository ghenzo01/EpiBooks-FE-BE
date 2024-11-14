import { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'

import './Welcome.css'

import { Alert } from 'react-bootstrap'


const Welcome = ({ welcomeTextForWelcomeComponent }) => {

    const { theme } = useContext(ThemeContext)

    return (
        <div
            className={`py-4 ${theme === 'dark' ? 'dark-theme-colors-for-div' : ''}`}
        >
            <Alert className={`text-center mb-0 bg-${theme === 'dark' ? 'primary' : ''} text-${theme === 'dark' ? 'light' : ''}`}>
                <h1>{welcomeTextForWelcomeComponent}</h1>
            </Alert>

        </div>
    )
}

export default Welcome