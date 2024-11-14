
import React from 'react'
import {Button} from 'react-bootstrap'



const Pagination = ({page, totalPages, onPageChange}) => {

  //calcolo del numero delle pagine
  const getPaginationNumbers = () => {
    let startPage = Math.max(1, page - 2)
    let endPage = Math.min(totalPages, page + 2)

    const paginationNumbers = []

    for (let i = startPage; i <= endPage; i++) {
      paginationNumbers.push(i)
  }
    return paginationNumbers
 }

  return (
    <div className="d-flex justify-content-center my-3">

      <Button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Previous
      </Button>
      
      {getPaginationNumbers().map((pageNum) => (

        <Button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          variant={pageNum === page ? 'primary' : 'outline-primary'}
          className="mx-1"
        >
          {pageNum}
        </Button>

      ))}

      <Button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        Next
      </Button>

    </div>
  )
}

export default Pagination