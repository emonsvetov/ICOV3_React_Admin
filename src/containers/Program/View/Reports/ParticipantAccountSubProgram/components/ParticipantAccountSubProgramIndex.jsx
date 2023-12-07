import React, {useEffect, useState, useParams} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import ParticipantAccountSubProgramTable from './ParticipantAccountSubProgramTable';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {connect} from "react-redux";
import { getAllPrograms } from '@/shared/apiHelper.jsx';


const ParticipantAccountSubProgramIndex = ({ organization }) => {
  const [defaultPrograms, setDefaultPrograms, program] = useState([]);

  // let {programId} = useParams();

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
      <ParticipantAccountSubProgramTable programs={defaultPrograms} program={program} />
  )
}

const mapStateToProps = (state) => {
  return {
    organization: state.organization,
    program: state.program,
  };
};
export default connect(mapStateToProps)(ParticipantAccountSubProgramIndex);