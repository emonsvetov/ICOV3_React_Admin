import React, {useEffect, useState} from 'react';
import ParticipantAccountSubProgramTable from './ParticipantAccountSubProgramTable';
import {isEmpty} from '@/shared/helpers'
import {connect} from "react-redux";
import { getAllPrograms } from '@/shared/apiHelper.jsx';
import {useParams} from "react-router-dom";


const ParticipantAccountSubProgramIndex = ({ organization }) => {
  const [defaultPrograms, setDefaultPrograms, program] = useState([]);

  let {programId} = useParams();

  useEffect(() => {
      getAllPrograms( "minimal=true&limit=99999999&programId=" +  programId )
          .then( response => {
              const data = response?.data ? response.data : [];
              const result = data.map(x => x.account_holder_id)
              setDefaultPrograms(result);
          })
  }, [programId])

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