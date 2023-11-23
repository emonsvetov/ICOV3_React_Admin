import React, {useEffect, useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import ParticipantStatusSummaryTable from './ParticipantStatusSummaryTable';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {connect} from "react-redux";


const ParticipantStatusSummaryIndex = ({ organization }) => {
  const [programs, setPrograms] = useState([]);
  const [defaultPrograms, setDefaultPrograms] = useState([]);


  const getData = async () => {
    const programsApiUrl = `/organization/${organization.id}/program/${1}/descendents?includeSelf=1&flat=1`
    if (isEmpty(programs)) {
      try {
        const response = await axios.get(programsApiUrl);
        if (response.data.length === 0) return {results: [], count: 0}

        const data = response.data;
        // console.log(data);
        setPrograms(data);
        return data;
      } catch (e) {
        throw new Error(`API error:${e?.message}`);
      }
    }
  }

  useEffect(() => {
    if (organization) {
      getData();
    }
    if (programs) {
      const result = programs.map(x => x.account_holder_id)
      setDefaultPrograms(result);
    }
  }, [programs, organization])

  if (isEmpty(defaultPrograms)) {
    return <p>Loading...</p>;
  }

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <ParticipantStatusSummaryTable programs={defaultPrograms} />
        </CardBody>
      </Card>
    </Col>
  )
}

const mapStateToProps = (state) => {
  return {
    organization: state.organization,
    program: state.program,
  };
};
export default connect(mapStateToProps)(ParticipantStatusSummaryIndex);