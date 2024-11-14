
import {Col, Container, Row} from "react-bootstrap"


import Spinner from "react-bootstrap/Spinner"


const LoadingSpinner = ({text}) => {
    return (
        <Container>
            <Row>
                <Col sm>

                    <div className="d-flex justify-content-center align-items-center py-5">

                        <Spinner animation="border" role="status" />
                        <div>{text}</div>

                    </div>

                </Col>
            </Row>
        </Container>
    )
}

export default LoadingSpinner