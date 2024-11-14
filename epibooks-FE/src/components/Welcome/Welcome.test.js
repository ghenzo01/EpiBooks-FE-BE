//1. Verifica che il componente Welcome venga montato correttamente.

import {render, screen } from '@testing-library/react'
import Welcome from './Welcome'

//se non fornisco anche il ThemeContext fallisce
import {ThemeContext } from '../../context/ThemeContext'


describe('Welcome Component', () => {


    it('should render Welcome component with provided text', () => {


        const welcomeText = 'Welcome to the Test!'
        //const theme = 'light'
        const theme = 'dark'


        render(
            <ThemeContext.Provider 
            value={{theme }}
            >
                <Welcome
                    welcomeTextForWelcomeComponent={welcomeText}
                />

            </ThemeContext.Provider>
        )

        //getByText(welcomeText) cerca se è renderizzato un componente con testo passatogli come prop
        const element = screen.getByText(welcomeText)
        expect(element).toBeInTheDocument()

    })
})