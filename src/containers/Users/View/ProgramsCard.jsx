import { Col, Container, Row, Card, CardBody } from 'reactstrap';
const ProgramsCard = ( {user}) => {
    return(
        <Card>
            <CardBody className='infoview'>
                <h3 className="mb-4">Programs</h3>
                <Row>
                    <Col md="6" lg="6" xl="6">
                        <form className='form'>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input type="text" name="program" placeholder="Search programs by ID or name" />
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default ProgramsCard