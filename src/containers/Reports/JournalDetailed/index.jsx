import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import JournalDetailedTable from './components/JournalDetailedDataTable.jsx';
import { getPrograms } from '@/shared/apiHelper.jsx';
import { isEmpty } from '@/shared/helpers';

const JournalDetailed = ({organization}) => {

  const [defaultPrograms, setDefaultPrograms] = useState([]);

  useEffect(() => {
    if ( organization?.id ){
      getPrograms( organization.id, "minimal=true" )
      .then( response => {
        const data = response?.data ? response.data : [];
        const result = data.map(x => x.account_holder_id)
        setDefaultPrograms(result);
      })
    }
  }, [organization])

  if (isEmpty(defaultPrograms)) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Journal Detailed</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / JournalDetailed</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <JournalDetailedTable programs={defaultPrograms} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
)}
export default withRouter(connect((state) => ({
  organization: state.organization
}))(JournalDetailed));
