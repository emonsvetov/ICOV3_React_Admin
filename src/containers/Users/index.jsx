import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import UsersIndexCard from './components/UsersIndex';
import Alert from '@/shared/components/Alert';

const UsersIndex = () => {
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
          <h3 className="page-title">Users</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Users</h3>
          {message !== "" && <Alert color="success">{message}</Alert>}
        </Col>
      </Row>
      <Row>
        <UsersIndexCard />
      </Row>
    </Container>
)}

export default UsersIndex;
