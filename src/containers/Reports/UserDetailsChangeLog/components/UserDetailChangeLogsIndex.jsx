import React,{ useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { Card, CardBody, Col } from 'reactstrap';
import UserDetailChangeLogsTable from './UserDetailChangeLogsTable';

const UnassignedIndex = ({organization}) => {
    // const { programId } = useParams();
    // const [program, setProgram] = useState(null);
    // const fetchProgramData = async(organization) => {
    //     try {
    //         const response = await axios.get(`/organization/${organization.id}/program/${programId}`);
    //         // console.log(response)
    //         setProgram(response.data)
    //     } catch (e) {
    //         throw new Error(`API error:${e?.message}`);
    //     }
    // };
    // useEffect(() => {
    //     if( organization )  {
    //         fetchProgramData(organization)
    //     }
    // },[organization])

    // if( !program?.id || !organization?.id )  {
    //     return 'Loading...'
    // }
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <UserDetailChangeLogsTable program={organization}/>
        </CardBody>
      </Card>
    </Col>
  )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(UnassignedIndex));
