import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ProgramIndexCard from './components/ProgramIndex';
import Alert from '@/shared/components/Alert';

const ProgramIndex = () => {
  useEffect(() => {
    checkFlashMessage()
  })
  const [message, setMessage] = useState('')
  const checkFlashMessage = () => {
    const params = new URLSearchParams(window.location.search)
    let message = params.get('message')
    if( message ) {
      setMessage(message)
    }
  }
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">All Programs</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Programs</h3>
          {message !== "" && <Alert color="success">{message}</Alert>}
        </Col>
      </Row>
      <Row>
        <ProgramIndexCard />
      </Row>
    </Container>
)}

export default ProgramIndex;
