import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import EventsIndexCard from './components/EventsIndex';
import Alert from '@/shared/components/Alert';

const EventsIndex = () => {
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
          <h3 className="page-title">Events</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Event</h3>
          {message !== "" && <Alert color="success">{message}</Alert>}
        </Col>
      </Row>
      <Row>
        <EventsIndexCard />
      </Row>
    </Container>
)}

export default EventsIndex;
