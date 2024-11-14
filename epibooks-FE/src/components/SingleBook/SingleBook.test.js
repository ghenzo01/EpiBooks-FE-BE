
//Test sul render di SingleBook


import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'

import {ThemeContext} from '../../context/ThemeContext'
import {SingleBook} from './SingleBook'

describe('Test SingleBook component', () => {

    it('should render card with passed props', () => {
        const theme = 'light'
        //const theme = 'dark'

        const {getByText} = render(
            <MemoryRouter>

                <ThemeContext.Provider 
                value={{theme}}
                >
                    <SingleBook

                        bookAsin={"123"}
                        bookTitle={"Test Title"}
                        bookImg={"test-image.jpg"}
                        bookPrice={"10"}
                        bookCategory={"Fantasy"}
                    />

                </ThemeContext.Provider>


            </MemoryRouter>
        )

        expect(getByText("Test Title")).toBeInTheDocument()
   })
})