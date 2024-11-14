//2. Verifica che vengano effettivamente renderizzate tante bootstrap cards quanti sono i libri nel
//file json utilizzato.

import {render, screen} from '@testing-library/react'

//se non importo il MemoryRouter il test dà errore
import {MemoryRouter} from 'react-router-dom'

import {AllTheBooks} from './AllTheBooks'

import fantasyBooks from '../../data/fantasy.json'

//se non fornisco anche il ThemeContext dà errore
import {ThemeContext} from '../../context/ThemeContext'


describe('AllTheBooks Component', () => {
    it('should render the correct number of cards based on the number books in the JSON file', () => {

        const selectedBook = null

        //const theme = 'light'
        const theme = 'dark'

        //funzione mock
        const setSelectedBook = jest.fn()

        render(

            <ThemeContext.Provider
                value={{theme}}
            >
                <MemoryRouter>
                    <AllTheBooks
                        //lo renderizzo nel caso in cui nella SearchBar di MyNav non è stato digitato nulla
                        searchTextFromApp=""
                        selectedBook={selectedBook}
                        setSelectedBook={setSelectedBook}
                    />
                </MemoryRouter>
            </ThemeContext.Provider>
        )

        //supponendo una immagine per card, prendo tutte le immagini
        const bookCards = screen.getAllByRole('img')

        //confronto numero card con numero libri
        expect(bookCards.length).toBe(fantasyBooks.length)
  })
})