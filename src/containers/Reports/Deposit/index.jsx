import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {Col, Container, Row, Card, CardBody} from 'reactstrap';
import DepositIndexDataTable from './components/DepositIndexDataTable';
import {isEmpty} from '@/shared/helpers'
import {getAllPrograms} from '@/shared/apiHelper.jsx';

const Deposit = () => {
  const [defaultPrograms, setDefaultPrograms] = useState([]);
  const [programOptions, setProgramOptions] = useState();
  const [wait, setWait] = useState(false);

  useEffect(() => {
    if (isEmpty(defaultPrograms) && wait === false) {
      setWait(true);
      getAllPrograms("minimal=true&limit=99999999")
        .then(response => {
          const data = response?.data ? response.data : [];
          const result = data.map(x => x.account_holder_id)
          const options = data.map(x => ({ label : x.name, value: x.id }))
          setDefaultPrograms(result);
          setProgramOptions(options)
          setWait(false);
        })
    }
  })

  if (isEmpty(defaultPrograms) || wait === true) {
    return <p>Loading...</p>;
  }
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Invoice Created</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Deposit</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <DepositIndexDataTable programs={defaultPrograms} programOptions={programOptions} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
)}

export default Deposit;
