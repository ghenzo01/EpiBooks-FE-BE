import React from 'react'
import {Form, Button} from 'react-bootstrap'
import './SearchBar.css'


const SearchBar = ({searchText, handleInputChange, triggerSearch}) => {
  return (
    
    <div className="d-flex flex-column align-items-start my-3">
      

      <p className="mb-1">Filter by Title, ASIN or ID</p>
      
      <div className="d-flex">

        <Form.Control
          className="w-50 me-2"
          type="text"
          placeholder="Type to search by title, ASIN, or ID"
          value={searchText}
          onChange={handleInputChange}
        />
        
        <Button variant="primary" onClick={triggerSearch}>Filter</Button>


      </div>
    </div>
  )
}

export default SearchBar
