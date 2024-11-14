import { render, screen } from '@testing-library/react'
import App from './App'

test('renders welcome message', () => {
  render(<App />)

  //testo Welcome section
  const linkElement = screen.getByText(/Welcome to EpiBooks!/i)

  expect(linkElement).toBeInTheDocument()
})