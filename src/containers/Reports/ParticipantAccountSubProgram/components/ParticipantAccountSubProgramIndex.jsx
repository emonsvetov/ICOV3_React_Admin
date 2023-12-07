import React, {useEffect, useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import ParticipantAccountSubProgramTable from './ParticipantAccountSubProgramTable';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {connect} from "react-redux";
import { getAllPrograms } from '@/shared/apiHelper.jsx';


const ParticipantAccountSubProgramIndex = ({ organization }) => {
  const [defaultPrograms, setDefaultPrograms] = useState([]);

  useEffect(() => {
    if ( isEmpty(defaultPrograms) ){
      getAllPrograms( "minimal=true&limit=99999999" )
          .then( response => {
            const data = response?.data ? response.data : [];
            const result = data.map(x => x.account_holder_id)
            setDefaultPrograms(result);
          })
    }
  })

  if (isEmpty(defaultPrograms)) {
    return <p>Loading...</p>;
  }

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <ParticipantAccountSubProgramTable programs={defaultPrograms} />
        </CardBody>
      </Card>
    </Col>
  )
}

const mapStateToProps = (state) => {
  return {
    organization: state.organization,
  };
};
export default connect(mapStateToProps)(ParticipantAccountSubProgramIndex);